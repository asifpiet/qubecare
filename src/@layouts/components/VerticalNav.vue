<script setup>
import { useAuth } from '@/composables/useAuth';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useRegisterSetupStore } from '@/stores/registerSetupStore';
import { useAbility } from '@casl/vue';
import { layoutConfig } from '@layouts';
import {
  VerticalNavGroup,
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts/components';
import { useLayoutConfigStore } from '@layouts/stores/config';
import { injectionKeyIsVerticalNavHovered } from '@layouts/symbols';
import { themeConfig } from '@themeConfig';
import { useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
import { VNodeRenderer } from './VNodeRenderer';
const { currentRole, authService, currentUser } = useAuth()
const practitionerStore = usePractitionerStore()
const store = useStore();
const providerStore = useRegisterSetupStore()
const userAbilities = ref([]);
const ability = useAbility()
const wizardSetup = ref();
const router = useRouter()
const props = defineProps({
  tag: {
    type: null,
    required: false,
    default: 'aside',
  },
  navItems: {
    type: null,
    required: true,
  },
  isOverlayNavActive: {
    type: Boolean,
    required: true,
  },
  toggleIsOverlayNavActive: {
    type: Function,
    required: true,
  },
})

const refNav = ref()
const isHovered = useElementHover(refNav)
const userData = useCookie('userData')
const userRole = userData.value?.role

provide(injectionKeyIsVerticalNavHovered, isHovered)

const configStore = useLayoutConfigStore()

const resolveNavItemComponent = item => {
  if ('heading' in item)
    return VerticalNavSectionTitle
  if ('children' in item)
    return VerticalNavGroup

  return VerticalNavLink
}

/*ℹ️ Close overlay side when route is changed
Close overlay vertical nav when link is clicked
*/
const route = useRoute()

watch(() => route.name, async () => {
  props.toggleIsOverlayNavActive(false)
  // await fetchUserAbilities()

})

const fetchUserAbilities = async () => {

  if (userRole === 'admin') {
    //  await store.dispatch('refreshAbilities');
    //  const permissionsStore = store.getters.getRefreshAbilities;
    //userAbilities.value = transformPermissions(permissionsStore);

    //localStorage.setItem('userAbilityRules', JSON.stringify(userAbilities.value));
    //useCookie('userAbilityRules').value = userAbilities.value;
    // ability.update(userAbilities.value);
    await providerStore.getWizardStup()
    wizardSetup.value = await providerStore.wizardStup
    if (wizardSetup.value.intake_question_count == 0
      //|| wizardSetup.value.intake_question_count == 0
      //|| wizardSetup.value.questiories_form_count == 0
      || wizardSetup.value.product_count == 0
      // || wizardSetup.value.affliate_product_count == 0
      //|| !wizardSetup.value.sync_google_account
      || !wizardSetup.value.payment_method_setup
    ) {
      await router.push({ name: 'provider-register-setup' })
    }
  }
};

const filteredNavItems = computed(() => {
  console.log('...', props.navItems); // Log original navItems for debugging 
  return props.navItems
  if (userRole === 'admin') {
    return props.navItems.filter(item => {
      // Check if the item has children  
      if ('children' in item) {
        console.log(item.children); // Log children for debugging  
        const visibleChildren = item.children.filter(child =>
          userAbilities.value.some(ability => ability.subject === child.subject && ability.action === 'read')
        );

        // If there are visible children, keep the parent item  
        return visibleChildren.length > 0;
      }

      // For items without children, check if the user has read permission  
      return userAbilities.value.some(ability =>
        ability.subject === item.subject && ability.action === 'read'
      );
    });
  } else {
    return props.navItems;
  }
});

const transformPermissions = (permissionsData) => {
  const transformedPermissions = [];
  transformedPermissions.push({ action: 'read', subject: 'Profile Update' })
  const processPermissions = (permissions) => {
    for (const permission of permissions) {
      if (permission.ability === true) {
        transformedPermissions.push({
          action: 'read', // Adjust based on your permission model
          subject: permission.text,
        });
      }

      if (permission.children) {
        for (const child of permission.children) {
          if (child.ability === true) {
            transformedPermissions.push({
              action: 'read', // Adjust based on your permission model
              subject: child.text,
            });
          }
        }
      }
    }
  };

  for (const group of permissionsData) {
    processPermissions(group.permissions);
  }

  return transformedPermissions;
};
const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = val => isVerticalNavScrolled.value = val

const handleNavScroll = evt => {
  isVerticalNavScrolled.value = evt.target.scrollTop > 0
}

const hideTitleAndIcon = configStore.isVerticalNavMini(isHovered)
const isUpcomingAppointments = computed(() => route.path.includes('/provider/calendar'));
const redirectPath = ref();

// Enhanced navigation logic for providers based on permissions
const getProviderRedirectPath = () => {
  if (ability.can('read', 'Dashboard View')) {
    return '/provider/dashboard'
  }
  return '/provider/calendar'
}

const roleRedirects = {
  provider: getProviderRedirectPath(),
  patient: '/patient/dashboard',
  affiliate: '/affiliate/dashboard',
  partner: '/partner/dashboard'
};

const logo = computed(() => {
  console.log("currentRole", currentRole.value);
  if (currentRole.value && roleRedirects[currentRole.value]) {
    redirectPath.value = roleRedirects[currentRole.value];
  }

  return themeConfig.app.logo;
});
</script>

<template>
  <Component :is="props.tag" ref="refNav" class="layout-vertical-nav" :class="[
    {
      'overlay-nav': configStore.isLessThanOverlayNavBreakpoint,
      'hovered': isHovered,
      'visible': isOverlayNavActive,
      'scrolled': isVerticalNavScrolled,
    },
  ]">
    <!-- 👉 Header -->
    <div class="nav-header">
      <slot name="nav-header">
        <div class="logo-div"></div>
        <RouterLink :to="redirectPath" class="app-logo app-title-wrapper">
          <VNodeRenderer :nodes="logo" />

          <Transition name="vertical-nav-app-title">
            <h1 v-show="!hideTitleAndIcon" class="app-logo-title">
              {{ themeConfig.app.title }}
            </h1>
          </Transition>
        </RouterLink>
        <!-- 👉 Vertical nav actions -->
        <!-- Show toggle collapsible in >md and close button in <md -->
        <div class="header-action">
          <Component :is="layoutConfig.app.iconRenderer || 'div'" v-show="configStore.isVerticalNavCollapsed"
            class="d-none nav-unpin" :class="configStore.isVerticalNavCollapsed && 'd-lg-block'"
            v-bind="layoutConfig.icons.verticalNavUnPinned"
            @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed" />
          <Component :is="layoutConfig.app.iconRenderer || 'div'" v-show="!configStore.isVerticalNavCollapsed"
            class="d-none nav-pin" :class="!configStore.isVerticalNavCollapsed && 'd-lg-block'"
            v-bind="layoutConfig.icons.verticalNavPinned"
            @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed" />
          <Component :is="layoutConfig.app.iconRenderer || 'div'" class="d-lg-none" v-bind="layoutConfig.icons.close"
            @click="toggleIsOverlayNavActive(false)" />
        </div>
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot name="nav-items" :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled">
      <PerfectScrollbar :key="configStore.isAppRTL" tag="ul" class="nav-items" :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll">

        <Component :is="resolveNavItemComponent(item)" v-for="(item, index) in filteredNavItems" :key="index"
          :item="item" />
        <!-- <div class="text-center sidebar-actions"
          v-if="isUpcomingAppointments && practitionerStore.navUsersToggle && practitionerStore.upcomingAppointments.length > 0">
          <VBtn :rounded="0" @click="practitionerStore.navUsersToggle = false" block>
            <VIcon icon="tabler-users" size="20" />
            <VTooltip activator="parent" location="top">
              Patient
            </VTooltip>
          </VBtn>
        </div> -->
      </PerfectScrollbar>

    </slot>
    <slot name="after-nav-items" />

  </Component>

</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: 0.25px;
    line-height: 1.5rem;
    text-transform: capitalize;
  }
}
</style>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

// 👉 Vertical Nav
.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: variables.$layout-vertical-nav-width;
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: inline-size 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;

  .nav-header {
    display: flex;
    align-items: center;
    margin: 10px 0px;
    margin-bottom: 10px;
    margin-inline: unset !important;
    padding: 10px 10px 10px 10px !important;

    .header-action {
      cursor: pointer;

      @at-root {
        #{variables.$selector-vertical-nav-mini} .nav-header .header-action {

          &.nav-pin,
          &.nav-unpin {
            display: none !important;
          }
        }
      }
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;

    // ℹ️ We no loner needs this overflow styles as perfect scrollbar applies it
    // overflow-x: hidden;

    // // ℹ️ We used `overflow-y` instead of `overflow` to mitigate overflow x. Revert back if any issue found.
    // overflow-y: auto;
  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 👉 Collapsed
  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }
}

// Small screen vertical nav transition
@media (max-width: 1279px) {
  .layout-vertical-nav {
    &:not(.visible) {
      transform: translateX(-#{variables.$layout-vertical-nav-width});

      @include mixins.rtl {
        transform: translateX(variables.$layout-vertical-nav-width);
      }
    }

    transition: transform 0.25s ease-in-out;
  }
}
</style>

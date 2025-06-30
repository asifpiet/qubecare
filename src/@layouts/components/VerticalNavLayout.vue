<script setup>
import { usePractitionerStore } from '@/stores/practitionerStore'
import { layoutConfig } from '@layouts'
import { VerticalNav } from '@layouts/components'
import { useLayoutConfigStore } from '@layouts/stores/config'
import { themeConfig } from '@themeConfig'
import { VNodeRenderer } from './VNodeRenderer'
const router = useRouter()
const route = useRoute()
const redirectPath = ref();
const { currentRole, authService, currentUser } = useAuth()
const practitionerStore = usePractitionerStore()
const props = defineProps({
  navItems: {
    type: null,
    required: true,
  },
  verticalNavAttrs: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const roleRedirects = {
  provider: '/provider/calendar',
  patient: '/patient/dashboard',
  affiliate: '/affiliate/dashboard',
  partner: '/partner/dashboard'
};
const { width: windowWidth } = useWindowSize()
const configStore = useLayoutConfigStore()
const isOverlayNavActive = ref(false)
const isLayoutOverlayVisible = ref(false)
const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)

// ℹ️ This is alternative to below two commented watcher

// We want to show overlay if overlay nav is visible and want to hide overlay if overlay is hidden and vice versa.
syncRef(isOverlayNavActive, isLayoutOverlayVisible)

// })

// ℹ️ Hide overlay if user open overlay nav in <md and increase the window width without closing overlay nav
watch(windowWidth, () => {
  if (!configStore.isLessThanOverlayNavBreakpoint && isLayoutOverlayVisible.value)
    isLayoutOverlayVisible.value = false
})
const isUpcomingAppointments = computed(() => route.path.includes('/provider/calendar'));

const verticalNavAttrs = computed(() => {
  const vNavAttrs = toRef(props, 'verticalNavAttrs')

  const {
    wrapper: verticalNavWrapper,
    wrapperProps: verticalNavWrapperProps,
    ...additionalVerticalNavAttrs
  } = vNavAttrs.value


  return {
    verticalNavWrapper,
    verticalNavWrapperProps,
    additionalVerticalNavAttrs,
  }
})
watch(
  () => currentUser.value?.company?.logo,
  (newLogo) => {
    if (newLogo) {

      // currentRole
      themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;max-height: 50px;">` });

    }
  },
  { immediate: true } // Trigger the watcher immediately on component mount
);
const logo = computed(() => {
  console.log("currentRole", currentRole.value);
  if (currentRole.value && roleRedirects[currentRole.value]) {
    redirectPath.value = roleRedirects[currentRole.value];
  }

  return themeConfig.app.logo;
});
</script>

<template>
  <div :class="[{ 'navbar-active': !configStore.isVerticalNavCollapsed }]">
    <div style="position: fixed;width: 100%;z-index: 1004;">
      <div>
        <header class="layout-navbar" :class="[{ 'navbar-blur': configStore.isNavbarBlurEnabled }]">
          <div class="d-flex navbar-content-container">

            <!-- <VCard id="logo-container">
              <VCardText class="py-2" v-if="logo">

                <RouterLink :to="redirectPath" class="app-logo app-title-wrapper">
                  <VNodeRenderer :nodes="logo" />

                  <Transition name="vertical-nav-app-title">
                    <h1 v-show="!hideTitleAndIcon" class="app-logo-title">
                      {{ layoutConfig.app.title }}
                    </h1>

                  </Transition>

                </RouterLink>

              </VCardText>

            </VCard> -->
            <VCard class="flex-grow-1" id="profile-container">

              <VCardText class="py-3 d-flex">
                <span class="patient-icon-wrapper"
                  v-if="isUpcomingAppointments && practitionerStore.upcomingAppointments.length > 0">
                  <VBtn :rounded="0" @click="practitionerStore.navUsersToggle = !practitionerStore.navUsersToggle"
                    class="patient-icon-btn">
                    <VIcon icon="tabler-users" size="20" />
                    <VTooltip activator="parent" location="top">
                      {{ $t('Patient') }}
                    </VTooltip>
                  </VBtn>
                </span>
                <slot name="navbar" :toggle-vertical-overlay-nav-active="toggleIsOverlayNavActive" />
              </VCardText>

            </VCard>

          </div>
        </header>
      </div>
    </div>
    <div class="layout-wrapper" :class="configStore._layoutClasses">
      <component :is="verticalNavAttrs.verticalNavWrapper ? verticalNavAttrs.verticalNavWrapper : 'div'"
        v-bind="verticalNavAttrs.verticalNavWrapperProps" class="vertical-nav-wrapper">
        
        <VerticalNav :is-overlay-nav-active="isOverlayNavActive"
          :toggle-is-overlay-nav-active="toggleIsOverlayNavActive" :nav-items="props.navItems"
          v-bind="{ ...verticalNavAttrs.additionalVerticalNavAttrs }">
          <template #nav-header>
            <slot name="vertical-nav-header" />

          </template>
          <template #before-nav-items>
            <!-- Add user profile section at the top of sidebar -->
            <div class="sidebar-user-profile" v-if="currentUser && !configStore.isVerticalNavCollapsed">
              <div class="d-flex align-center px-4 py-3 sidebar-profile-card">
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                <VAvatar size="45" color="primary" variant="tonal" class="me-1" rounded="sm">
                  <VImg v-if="currentUser.avatar" :src="currentUser.avatar" />
                  <VIcon v-else icon="tabler-user" />
                </VAvatar>
                </VBadge>
                <div class="user-info ml-2">
                  <h6 class="text-h6 text-white font-weight-medium mb-0 text-capitalize">
                    {{ currentUser.fullName || currentUser.username || 
                      (currentUser.fname && currentUser.lname ? currentUser.fname + ' ' + currentUser.lname : '') || 
                      (currentUser.firstName && currentUser.lastName ? currentUser.firstName + ' ' + currentUser.lastName : '') || 
                      'Anonymous' }}
                  </h6>
                  <span class="text-white text-opacity-70 text-xs text-capitalize text-disabled">{{ currentUser.user_type }}</span>
                </div>
              </div>
            </div>
            <slot name="before-vertical-nav-items" />
          </template>

        </VerticalNav>
      </component>
      <div class="layout-content-wrapper">

        <main class="layout-page-content">
          <div class="page-content-container">
            <slot />
          </div>
        </main>
        <footer class="layout-footer">
          <div class="footer-content-container">
            <slot name="footer" />
          </div>
        </footer>
      </div>
      <div class="layout-overlay" :class="[{ visible: isLayoutOverlayVisible }]"
        @click="() => { isLayoutOverlayVisible = !isLayoutOverlayVisible }" />
    </div>
  </div>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

#logo-container {
  width: 260px;
  border-radius: 0px !important;
  border-right: 0px;
  background: linear-gradient(180deg, #0C1426 0%, #1A202C 100%);
  box-shadow: 3px 1px 3px rgba(0, 0, 0, 0.12) !important;
}

#profile-container {
  border-radius: 0px !important;
  border-left: 0px;
  border-bottom: none;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04) !important;
}

@media screen and (max-width: 780px) {
  #logo-container {
    display: none;
  }
}

.layout-vertical-nav {
  top: 50px
}

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-width;
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }

          /* stylelint-disable-next-line @stylistic/indentation */
          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: opacity;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Adjust right column pl when vertical nav is collapsed
  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Content height fixed
  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}

// Sidebar styling to match the provided image
.vertical-nav-wrapper {
  .layout-vertical-nav {
    background: linear-gradient(180deg, #0C1426 0%, #1A202C 100%);
    backdrop-filter: blur(10px);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    
    // User profile section
    .sidebar-profile-card{
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 5px;
    }
    .sidebar-user-profile {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 10px;
      padding: 20px 12px;
      
      .user-info {
        overflow: hidden;
        
        h6 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1rem;
        }
      }
    }
    
    // Menu items styling
    .nav-item {
      margin-bottom: 4px;
      
      .nav-link {
        border-radius: 0;
        margin: 0;
        padding: 10px 16px;
        position: relative;
        
        &.router-link-active {
          background-color: rgba(255, 255, 255, 0.05);
          color: #00A68B;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background-color: #00A68B;
          }
          
          .nav-item-icon {
            color: #00A68B;
          }
          
          .nav-item-title {
            color: #00A68B;
            font-weight: 600;
          }
        }
        
        &:hover:not(.router-link-active) {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .nav-item-icon {
          color: rgba(255, 255, 255, 0.7);
          margin-right: 12px;
          font-size: 1.25rem;
        }
        
        .nav-item-title {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          font-size: 0.9rem;
        }
      }
    }
    
    // Badge styling for notifications
    .v-badge__badge {
      background-color: #ff5252;
      color: white;
    }
    
    // Section titles
    .nav-section-title {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
      padding: 0 16px;
      margin-top: 16px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
}

// Adjust top position to account for the header
.layout-vertical-nav {
  top: 0px;
  height: calc(100% - 0px);
  z-index: 99999;
}

// Adjust the content area when sidebar is collapsed
.layout-wrapper.layout-vertical-nav-collapsed {
  .layout-vertical-nav {
    .sidebar-user-profile {
      .user-info {
        display: none;
      }
    }
    
    .nav-item {
      .nav-link {
        &.router-link-active {
          &::before {
            width: 3px;
          }
        }
      }
    }
  }
}

.header-action{
  color: white;
}

.layout-nav-type-vertical .layout-vertical-nav .nav-link{
  color: rgba(255, 255, 255, 0.7) !important;
}

.layout-nav-type-vertical .layout-vertical-nav .nav-group{
  color: rgba(255, 255, 255, 0.7) !important;
}

.layout-horizontal-nav .nav-link:not(.sub-item) a.router-link-active, .layout-horizontal-nav .nav-group:not(.sub-item).active > .popper-triggerer > .nav-group-label, .layout-nav-type-vertical .layout-vertical-nav .nav-link > .router-link-exact-active{
  color: white;
  border-left: 3px solid #3B82F6 !important;
}
</style>

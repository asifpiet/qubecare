<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const ability = useAbility()
const { currentUser, currentRole, logout } = useAuth()
// TODO: Get type from backend
const userData = currentUser
const userRole = currentRole

onMounted(async () => {
  console.log("UserProfile", userData.value, userRole.value);
  // if(userData.value?.role === 'patient')
  // {
  //   let id = currentUser.value.id;
  //   await store.dispatch('getPatientPortalProfile',{
  //     id:id,
  //   })
  //   let profile =  store.getters.getPatientPortalProfile;
  //   if(profile.profilePicture){
  //     userData.value.avatar = profile.profilePicture;
  //   }
  // }
  // if(userData.value?.role === 'provider')
  // {
  //   let id = currentUser.value.uuid;
  //   await store.dispatch('getProviderProfile',{
  //     id:id,
  //   })
  //   let profile =  store.getters.getProviderProfile;
  //   if(profile.profile_image_url){
  //     userData.value.avatar = profile.profile_image_url;
  //   }
  // }
  // console.log("profile",profile);
  // const res = await $api(`${GET_PROVIDER_API}/`+id, {
  //   method: 'GET',
  // });
  // console.log('resUser', res);
  // if(res.data.profile_image_url){
  //   userData.value.avatar = res.data.profile_image_url;
  // }
});

const userProfileList = computed(() => {
  let settingsRouteName = 'provider-settings-account-settings-tab';
  if (userRole.value === 'partner') {
    settingsRouteName = 'partner-settings';
  } else if (userRole.value === 'affiliate') {
    settingsRouteName = 'affiliate-settings';
  }
  else if (userRole.value === 'patient') {
    settingsRouteName = 'patient-settings';
  }
  else if (userRole.value === 'network') {
    settingsRouteName = 'network-settings-tab';
  }
  else if (userRole.value === 'admin') {
    settingsRouteName = 'admin-setting';
  }
  return [
    { type: 'divider' },
    {
      type: 'navItem',
      icon: 'tabler-settings',
      title: 'Settings',
      to: {
        name: settingsRouteName,
        params: { tab: 'account' },
      },
    },
    // {
    //   type: 'navItem',
    //   icon: 'tabler-settings',
    //   title: 'Company Settings',
    //   to: {
    //     name: 'provider-settings-website-setting',
    //   },
    //   action: 'read',
    //   subject: 'Company Settings View',
    // },
    { type: 'divider' },
  ];
});
</script>

<template>
  <!-- <VBadge v-if="userData" dot bordered location="bottom right" offset-x="1" offset-y="2" color="success"> -->
    <div class="d-flex align-center">
      <VAvatar size="38" class="cursor-pointer" color="primary" variant="tonal" rounded="sm">
        <VImg v-if="userData && userData.avatar && userRole !== 'affiliate' && userRole !== 'partner'" :src="userData.avatar" />
        <VIcon v-else icon="tabler-user" />

        <!-- SECTION Menu -->
        <VMenu activator="parent" width="240" location="bottom end" offset="12px">
          <VList>
            <VListItem>
              <div class="d-flex gap-2 align-center">
                <!-- <VListItemAction>
                  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                    <VAvatar color="primary" variant="tonal" rounded="sm">
                      <VImg v-if="userData && userData.avatar && userRole !== 'affiliate' && userRole !== 'partner'" :src="userData.avatar" />
                      <VIcon v-else icon="tabler-user" />
                    </VAvatar>
                  </VBadge>
                </VListItemAction> -->
                <div>
                  <h6 class="text-h6 font-weight-medium text-capitalize">
                    {{
                      userData.fullName
                      || userData.username
                      || (userData.fname && userData.lname ? userData.fname + ' ' + userData.lname : '')
                      || (userData.firstName && userData.lastName ? userData.firstName + ' ' + userData.lastName : '')
                      || 'Anonymous'
                    }}
                  </h6>
                  <!-- <VListItemSubtitle class="text-capitalize text-disabled">
                    {{ $t(' {userRole}', { 'userRole': userData.user_type }) }}
                  </VListItemSubtitle> -->
                  <VListItemSubtitle class="text-capitalize text-grey">
                    {{ userData.email }}
                  </VListItemSubtitle>
                </div>
              </div>
            </VListItem>

            <PerfectScrollbar :options="{ wheelPropagation: false }">
              <template v-for="item in userProfileList" :key="item.title">
                <VListItem v-if="item.type === 'navItem'" :to="item.to">
                  <template #prepend>
                    <VIcon :icon="item.icon" size="22" />
                  </template>

                  <VListItemTitle> {{ item.title }}</VListItemTitle>

                  <template v-if="item.badgeProps" #append>
                    <VBadge rounded="sm" class="me-3" v-bind="item.badgeProps" />
                  </template>
                </VListItem>

                <VDivider v-else />
              </template>
              <div class="px-4 py-2 border-t-2">
                <VBtn block size="small" color="error" variant="text" @click="logout">
                  <VIcon
                    start
                    size="20"
                    icon="tabler-logout"
                  />
                  {{ $t('Logout') }}
                </VBtn>
              </div>
            </PerfectScrollbar>
          </VList>
        </VMenu>
        <!-- !SECTION -->
      </VAvatar>
      <VIcon icon="tabler-chevron-down" size="18" class="ms-1" />
    </div>
  <!-- </VBadge> -->
</template>

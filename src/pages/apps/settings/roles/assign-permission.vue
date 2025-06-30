
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import FolderTreeItem from './FolderTreeItem.vue';
const route = useRoute();
const store = useStore()
const loading = ref(true)
const searchQuery = ref('')
const permissionsTree = ref([])
const selectedPermissions = ref([])
const ability = useAbility()
const userAbilities = ref([]);

const selectedPermissionsIds = computed(() => {
  return selectedPermissions.value.join(',')
})

const filteredPermissionsTree = computed(() => {
  if (!searchQuery.value) return permissionsTree.value

  const searchLower = searchQuery.value.toLowerCase()

  function filterTree(nodes) {
    return nodes.reduce((filtered, node) => {
      const nameMatch = node.text.toLowerCase().includes(searchLower)
      if (node.children) {
        const filteredChildren = filterTree(node.children)
        if (nameMatch || filteredChildren.length) {
          filtered.push({
            ...node,
            children: filteredChildren
          })
        }
      } else if (nameMatch) {
        filtered.push(node)
      }
      return filtered
    }, [])
  }

  return filterTree(permissionsTree.value)
})

const fetchPermissions = async () => {
  await store.dispatch('permissionsRole', {
    id: route.params.id,
  });
  let permission = store.getters.getPermissionsRole;
  console.log(permission);
  
  // Process the permissions to add state if not present
  const processPermissions = (items) => {
  // Check if `items` is a valid array before proceeding
  if (!Array.isArray(items)) {
    console.warn('Expected an array but received:', items);
    return [];
  }

  return items.map(item => {
    // Create a copy of the item to avoid mutating the original array
    let newItem = { ...item };

    // Recursively process all children if they exist
    if (newItem.children && Array.isArray(newItem.children)) {
      newItem.children = processPermissions(newItem.children);
    }

    // Ensure `state` is set with `selected: false` if not already present
    if (!newItem.state) {
      newItem.state = { selected: false };
    }

    return newItem;
  });
};

  permissionsTree.value = processPermissions(permission.children);
  loading.value = false;
};

function searchPermissions() {
  // The filtering is handled by the computed property filteredPermissionsTree
}


const savePermissions = async () => {
  const getSelectedIds = (items) => {
    return items.reduce((acc, item) => {
      if (item.children) {
        acc.push(...getSelectedIds(item.children));
      } else if (item.state && item.state.selected) {
        acc.push(item.id);
      }
      return acc;
    }, []);
  };

  const selectedIds = getSelectedIds(permissionsTree.value);
  console.log('Saving permissions:', selectedIds.join(','));
  await store.dispatch('permissionsUpdate', {
    id: route.params.id,
    permisssions: selectedIds.join(',')
  });
 await fetchUserAbilities()
};

function togglePermission(id) {
  const index = selectedPermissions.value.indexOf(id)
  if (index === -1) {
    selectedPermissions.value.push(id)
  } else {
    selectedPermissions.value.splice(index, 1)
  }
}
  const updateSelectedPermissions = (newSelectedPermissions) => {
      selectedPermissions.value = newSelectedPermissions;
    };
onMounted(() => {
  fetchPermissions()
  
  
})
const fetchUserAbilities = async () => {  
  await store.dispatch('refreshAbilities');  
  const permissionsStore = store.getters.getRefreshAbilities;  
  userAbilities.value = transformPermissions(permissionsStore);  
  
  localStorage.setItem('userAbilityRules', JSON.stringify(userAbilities.value));  
  useCookie('userAbilityRules').value = userAbilities.value;  
  ability.update(userAbilities.value);  
}; 
const transformPermissions = (permissionsData) => {
  const transformedPermissions = [];

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
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <h3>Assign Role Permissions</h3>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h4 v-if="loading">Loading.....</h4>
                <div v-else>
                  <v-text-field
                    v-model="searchQuery"
                    label="Search Permission..."
                    prepend-inner-icon="mdi-magnify"
                    @input="searchPermissions"
                  ></v-text-field>
                  <folder-tree-item
                    v-for="item in filteredPermissionsTree"
                    :key="item.id"
                    :item="item"
                      :selected-permissions="selectedPermissions"
                      @update:selected-permissions="updateSelectedPermissions"
                    @toggle-permission="togglePermission"
                  />
                  <v-form @submit.prevent="savePermissions">
                    <input type="hidden" name="permissions" :value="selectedPermissionsIds">
                    <v-btn
                      color="primary"
                      type="submit"
                      class="mt-4"
                    >
                      Save Permissions
                    </v-btn>
                  </v-form>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



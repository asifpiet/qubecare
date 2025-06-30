 import store from '@/store'
import { ADD_INVENTORY_API, ADD_ORDER_API, ADD_USER_API, DELETE_INVENTORY_API, GET_FILTERED_APPOINTMENT, GET_LOCATIONS_API, GET_SINGLE_USER, GET_USERS_LIST, INVENTORY_API, LOCATIONS_API, PATIENT_API, PATIENT_TASK_API, REGISTER_PATIENT_API, STORE_NEW_APPOINTMENT, UPDATE_INVENTORY_API, UPDATE_IP_ACCESS_API, UPDATE_USER_API } from '@/utils/constants'
import { paginateArray } from '@api-utils/paginateArray'
import { db } from '@db/apps/users/db'
import is from '@sindresorhus/is'
import destr from 'destr'
import { HttpResponse, http } from 'msw'

export const handlerAppsUsers = [
  

  //Health Maintance List

  http.get(('/api'+HEALTH_MAINTANCE_API), ({ request }) => {
    // console.log('getalluser');
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    // const role = url.searchParams.get('role')
    // const plan = url.searchParams.get('plan')
    // const status = url.searchParams.get('status')
    const sortBy = url.searchParams.get('sortBy')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')
    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1
    // filter users
    let filteredUsers = healthMantaince;
    // sort users
    
    const totalUsers = filteredUsers.length
  
    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    console.log("codelfi",filteredUsers);
    return HttpResponse.json({
      data: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }, { status: 200 })
  }),

  http.post(('/api'+ADD_TASK_API), async ({ request }) => {
    const user = await request.json();
    
    db.patientTasks.push({
      ...user,
      id: db.patientTasks.length + 1,
    })
    if(user){
      console.log("user",user, db.patientTasks);
    }
    return HttpResponse.json({ body: user }, { status: 201 })
  }),

  http.get(('/api'+PATIENT_TASK_API), async({ request }) => {
    // filter users
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const sortBy = url.searchParams.get('sortBy')
    const vendor_name = url.searchParams.get('vendor_name')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')
    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1
    let filteredUsers = db.tasks;
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    // console.log("filteredUsers",filteredUsers);  

    if (vendor_name) {
      filteredInventory = filteredUsers.filter(item =>
          item.vendor_name.toLowerCase() === vendor_name.toLowerCase()
      );
    }

    return HttpResponse.json({
      tasks: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }, { status: 202 });
    
  }),
  //Add New Order 
  http.post(('/api'+ADD_ORDER_API), async ({ request }) => {
    const user = await request.json();
    
    db.purchaseOrders.push({
      ...user,
      id: db.purchaseOrders.length + 1,
    })
    if(user){
      console.log("user",user, db.purchaseOrders);
    }
    return HttpResponse.json({ body: user }, { status: 201 })
  }),
  // PURCHASE_ORDER_API
  http.get(('/api'+PURCHASE_ORDER_API), async({ request }) => {
    // filter users
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const sortBy = url.searchParams.get('sortBy')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')
    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1
    let filteredUsers = db.purchaseOrders;
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    // console.log("filteredUsers",filteredUsers);  

    

    return HttpResponse.json({
      purchaseOrderHistory: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }, { status: 202 });
    
  }),
  //inventory APi
  http.get(('/api'+INVENTORY_API), async({ request }) => {
    // filter users
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const sortBy = url.searchParams.get('sortBy')
    const vendor_name = url.searchParams.get('vendor_name')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')
    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1
    let filteredUsers = db.inventory;
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    // console.log("filteredUsers",filteredUsers);  

    if (vendor_name) {
      filteredInventory = filteredUsers.filter(item =>
          item.vendor_name.toLowerCase() === vendor_name.toLowerCase()
      );
    }

    return HttpResponse.json({
      inventory: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }, { status: 202 });
    
  }),

  http.get(`/api${GET_SINGLE_INVENTORY_API}/:id`, ({ params }) => {
    const inventoryId = Number(params.id);
    const inventory = db.inventory.find(e => e.id === inventoryId);
    
    if (!inventory) {
      return HttpResponse.json({ message: 'Location not found' }, { status: 404 });
    } else {
      return HttpResponse.json({
        ...inventory,
      }, { status: 200 });
    }
  }),

  http.post(('/api'+ADD_INVENTORY_API), async ({ request }) => {
    const user = await request.json();
    
    db.inventory.push({
      ...user,
      id: db.inventory.length + 1,
    })
    if(user){
      console.log("user", db.inventory);
      // await store.dispatch('getUser',db.inventory);
    
    }
  
    
    return HttpResponse.json({ body: user }, { status: 201 })
  }),
  http.delete(`/api${DELETE_INVENTORY_API}/:id`, ({ params }) => {
    const userId = Number(params.id)
    const userIndex = db.inventory.findIndex(e => e.id === userId)
    if (userIndex === -1) {
      return HttpResponse.json('Inventory not found', { status: 404 })
    }
    else {
      db.inventory.splice(userIndex, 1)
      
      return new HttpResponse(null, {
        status: 204,
      })
    }
  }),

  http.put(('/api' + UPDATE_INVENTORY_API + '/:id'), async ({ params, request }) => {

    const userId = Number(params.id);
    console.log('userId', userId)
  
    // Find the user by ID
    const userIndex = db.inventory.findIndex(e => e.id === userId);
    // If user is not found, return a 404 error
    if (userIndex === -1) {
      return HttpResponse.json({ message: 'Inventory not found' }, { status: 404 });
    }
    
    // Get the updated user data from the request body
    const updatedUserData = await request.json();
  
    // Merge the existing user data with the updated data
    const updatedUser = {
      ...db.inventory[userIndex],  // Existing user data
      ...updatedUserData,      // New updated data
       // Recompute fullName if names change
    };
  
    // Update the user in the db
    db.inventory[userIndex] = updatedUser;
  
    // Dispatch the updated user profile to the Vuex store
    try {
      // console.log("all",db.users);
      // Return success response with the updated user data
     
      return HttpResponse.json({ body: updatedUser }, { status: 200 });
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Return error response if Vuex dispatch fails
      return HttpResponse.json({ message: 'Error updating user profile' }, { status: 500 });
    }
  }),
  
  // Get Location
  http.get((GET_LOCATIONS_API), ({ request }) => {
    // filter users
    let filteredUsers = db.locations;
    console.log("filteredUsers",filteredUsers);  
    return HttpResponse.json({ locations: filteredUsers }, { status: 202 });
    
  }),
   //GET Uselist User Management
  http.get(('/api'+GET_USERS_LIST), async ({ request }) => {
    // filter users
    let filteredUsers = db.userList;
    console.log("filterUserMangementList", filteredUsers); 
    //await store.dispatch('getUser',filteredUsers);
    return HttpResponse.json({ userList: filteredUsers }, { status: 202 });
    
  }),

  //GET ALL Location
  http.get(('/api'+LOCATIONS_API), async ({ request }) => {
    // filter users
    let filteredUsers = db.locations;
    console.log("locations", filteredUsers); 
    // await store.dispatch('getUser',filteredUsers);
    return HttpResponse.json({ locations: filteredUsers }, { status: 202 });
    
  }),
  //GET Single Location

  http.get((`${GET_LOCATIONS_API}/:id`), ({ params }) => {
    const locastionId = Number(params.id)
    const location = db.locations.find(e => e.id === locastionId)
    if (!location) {
      return HttpResponse.json({ message: 'Location not found' }, { status: 404 })
    }
    else {
      return HttpResponse.json({
        ...location,
      }, { status: 200 })
    }
  }),
  http.get(('/api'+GET_SINGLE_USER+'/:id'), ({ params }) => {
    const userId = Number(params.id)
    const location = db.userList.find(e => e.id === userId)
    if (!location) {
      return HttpResponse.json({ message: 'user not found' }, { status: 404 })
    }
    else {
      return HttpResponse.json({
        ...location,
      }, { status: 200 })
    }
  }),
  // add userlist === user management
  http.post(('/api'+ADD_USER_API), async ({ request }) => {
    const user = await request.json();
    console.log('userdd',user)
    
    db.userList.push({
      ...user,
      id: db.userList.length + 1,
    })
    if(user){
      console.log("user", db.userList);
      await store.dispatch('getUser',db.userList);
    
    }
  
    
    return HttpResponse.json({ body: user }, { status: 201 })
  }),
 // update userlist === user management
  http.put(('/api' + UPDATE_USER_API + '/:id'), async ({ params, request }) => {

    const userId = Number(params.id);
    console.log('userId', userId)
  
    // Find the user by ID
    const userIndex = db.userList.findIndex(e => e.id === userId);
    // If user is not found, return a 404 error
    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Get the updated user data from the request body
    const updatedUserData = await request.json();
  
    // Merge the existing user data with the updated data
    const updatedUser = {
      ...db.userList[userIndex],  // Existing user data
      ...updatedUserData,      // New updated data
       // Recompute fullName if names change
    };
  
    // Update the user in the db
    db.userList[userIndex] = updatedUser;
  
    // Dispatch the updated user profile to the Vuex store
    try {
      // console.log("all",db.users);
      // Return success response with the updated user data
     
      return HttpResponse.json({ body: updatedUser }, { status: 200 });
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Return error response if Vuex dispatch fails
      return HttpResponse.json({ message: 'Error updating user profile' }, { status: 500 });
    }
  }),
//ADD Patient
  http.post(('/api'+REGISTER_PATIENT_API), async ({ request }) => {
    const user = await request.json();
    
    db.users.push({
      ...user,
      id: db.users.length + 1,
    })
    if(user){
      console.log("user",user, db.users);
    }
    return HttpResponse.json({ body: user }, { status: 201 })
  }),
  // Get Patient List
http.get(('/api'+PATIENT_API), ({ request }) => {
  // console.log('getalluser');
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  // const role = url.searchParams.get('role')
  // const plan = url.searchParams.get('plan')
  // const status = url.searchParams.get('status')
  const sortBy = url.searchParams.get('sortBy')
  const itemsPerPage = url.searchParams.get('itemsPerPage')
  const page = url.searchParams.get('page')
  const orderBy = url.searchParams.get('orderBy')
  const searchQuery = is.string(q) ? q : undefined
  const queryLower = (searchQuery ?? '').toString().toLowerCase()
  const parsedSortBy = destr(sortBy)
  const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
  const parsedOrderBy = destr(orderBy)
  const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
  const parsedItemsPerPage = destr(itemsPerPage)
  const parsedPage = destr(page)
  const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
  const pageLocal = is.number(parsedPage) ? parsedPage : 1
  // filter users
  let filteredUsers = db.users.filter(user => ((user.fullName.toLowerCase().includes(queryLower) || user.email.toLowerCase().includes(queryLower)))).reverse()

  // sort users
  if (sortByLocal) {
    console.log(sortByLocal)
    if (sortByLocal === 'user') {
      filteredUsers = filteredUsers.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.fullName.localeCompare(b.fullName)
        else
          return b.fullName.localeCompare(a.fullName)
      })
    }
    if (sortByLocal === 'email') {
      filteredUsers = filteredUsers.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.email.localeCompare(b.email)
        else
          return b.email.localeCompare(a.email)
      })
    }
  }
  const totalUsers = filteredUsers.length

  // total pages
  const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
  console.log("codelfi",filteredUsers);
  return HttpResponse.json({
    data: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
    totalPages,
    totalUsers,
    page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
  }, { status: 200 })
}),

  http.get(('/api/apps/users'), ({ request }) => {
    // console.log('getalluser');
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    // const role = url.searchParams.get('role')
    // const plan = url.searchParams.get('plan')
    // const status = url.searchParams.get('status')
    const sortBy = url.searchParams.get('sortBy')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')
    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1
    // filter users
    let filteredUsers = db.users.filter(user => ((user.fullName.toLowerCase().includes(queryLower) || user.email.toLowerCase().includes(queryLower)))).reverse()

    // sort users
    if (sortByLocal) {
      console.log(sortByLocal)
      if (sortByLocal === 'user') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.fullName.localeCompare(b.fullName)
          else
            return b.fullName.localeCompare(a.fullName)
        })
      }
      if (sortByLocal === 'email') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.email.localeCompare(b.email)
          else
            return b.email.localeCompare(a.email)
        })
      }
    }
    const totalUsers = filteredUsers.length

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    
    return HttpResponse.json({
      users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }, { status: 200 })
  }),

  //GET Patient
  http.get(('/api'+PATIENT_API+'/:id'), ({ params }) => {
    const userId = Number(params.id)
    const user = db.users.find(e => e.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    else {
      return HttpResponse.json({
        ...user,
        ...{
          taskDone: 1230,
          projectDone: 568,
          taxId: 'Tax-8894',
          language: 'English',
        },
      }, { status: 200 })
    }
  }),
  // Get Single User Detail
  http.get(('/api/apps/users/:id'), ({ params }) => {
    const userId = Number(params.id)
    const user = db.users.find(e => e.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    else {
      return HttpResponse.json({
        ...user,
        ...{
          taskDone: 1230,
          projectDone: 568,
          taxId: 'Tax-8894',
          language: 'English',
        },
      }, { status: 200 })
    }
  }),

  // Delete User
  http.delete(('/api/apps/users/:id'), ({ params }) => {
    const userId = Number(params.id)
    const userIndex = db.users.findIndex(e => e.id === userId)
    if (userIndex === -1) {
      return HttpResponse.json('User not found', { status: 404 })
    }
    else {
      db.users.splice(userIndex, 1)
      
      return new HttpResponse(null, {
        status: 204,
      })
    }
  }),

  // 👉 Add user
  http.post(('/api/apps/users'), async ({ request }) => {
    const user = await request.json();
    
    db.users.push({
      ...user,
      id: db.users.length + 1,
    })
    if(user){
      console.log("user",user, db.users);
      await store.dispatch('savePatientPorfile',{
        patientId:db.users.length,
        firstName:user.firstName,
        lastName:user.lastName,
        fullName: user.firstName+' '+user.lastName,
        middleName: user.MiddleName,
        preferredPhone: user.preferredPhone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
      });
    }
  
    
    return HttpResponse.json({ body: user }, { status: 201 })
  }),

  // 👉 Update user
http.put(('/api/apps/users/:id'), async ({ params, request }) => {
  const userId = Number(params.id);
  
  // Find the user by ID
  const userIndex = db.users.findIndex(e => e.id === userId);
  // If user is not found, return a 404 error
  if (userIndex === -1) {
    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }
  
  // Get the updated user data from the request body
  const updatedUserData = await request.json();

  // Merge the existing user data with the updated data
  const updatedUser = {
    ...db.users[userIndex],  // Existing user data
    ...updatedUserData,      // New updated data
     // Recompute fullName if names change
  };

  // Update the user in the db
  db.users[userIndex] = updatedUser;

  // Dispatch the updated user profile to the Vuex store
  try {
    // console.log("all",db.users);
    // Return success response with the updated user data
    return HttpResponse.json({ body: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    // Return error response if Vuex dispatch fails
    return HttpResponse.json({ message: 'Error updating patient profile' }, { status: 500 });
  }
}),


   // GET ip access User Management
   http.get(('/api'+GET_LIST_IP_ACCESS_API), async ({ request }) => {
    // filter users
    let iplist = db.ipAccess;
    console.log("filterUserMangementList", iplist); 

    return HttpResponse.json({  iplist }, { status: 202 });
    
   }),
   http.post(('/api'+UPDATE_IP_ACCESS_API), async ({ request }) => {
    const iplist = await request.json();
    
    db.ipAccess.push({
      ...iplist,
      id: db.ipAccess.length + 1,
    })
    if(iplist){
      console.log("user",iplist, db.ipAccess);
      await store.dispatch('setFakeipAccess',db.ipAccess);
    }
  
    
    return HttpResponse.json({ body: iplist }, { status: 201 })
  }),

   
   //GET Phone Log
   http.get(('/api'+GET_LIST_PHONE_LOG_API), async ({ request }) => {
    // filter users
    let phoneLogList = db.phoneLogList;
    console.log("filterUserMangementList", phoneLogList); 

    return HttpResponse.json({  phoneLogList }, { status: 202 });
    
   }),
   http.post(('/api'+ADD_PHONE_LOG), async ({ request }) => {
     const user = await request.json();
     const now = new Date();  
    
    // Format the date to "MM/DD/YYYY HH:mm"  
    const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;  
    user.date= formattedDate
      user.provider= "nasir"
      user.message= user.message
      user.pdfUrl= "https://example.com/file1.pdf"
    db.phoneLogList.push({
      ...user,
      id: db.phoneLogList.length + 1,
    })
    if(user){
      console.log("user",user, db.phoneLogList);
    
    }
    
    await store.dispatch('setPhoneLogList',db.phoneLogList);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_MESSAGE_LIST), async ({ request }) => {
    // filter users
    let messageList = db.messageList;
    console.log("filterUserMangementList", messageList); 

    return HttpResponse.json({  messageList }, { status: 202 });
    
   }),
   http.post(('/api'+Add_MESSAGE_API), async ({ request }) => {
     const user = await request.json();
     const now = new Date();  
    
    // Format the date to "MM/DD/YYYY HH:mm"  
    const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;  
     user.date = formattedDate
     user.number_of_message = '1'
     user.unread_message = '0'
     user.with_name = "John Doe",
       console.log(user)
    db.messageList.push({
      ...user,
      id: db.messageList.length + 1,
    })
    console.log("user",user, db.messageList);
    
    //await store.dispatch('setMessageList',db.messageList);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_SUBJECT_MESSAGE+'/:id'), async ({ request }) => {
    // filter users
    let subjectMessageList = db.subjectMessageList;
    console.log("subjectMessageList", subjectMessageList); 

    return HttpResponse.json({  subjectMessageList }, { status: 202 });
    
   }),
   http.post(('/api'+ADD_MESSAGE_ON_BASE_SUBJECT+'/:id'), async ({ request }) => {
    const user = await request.json();
    user.message_id=1,
    user.text=user.message,
    user.message_by='Zeeshan Anjum',
    user.date="2024-10-18T09:30:00Z"
    db.subjectMessageList.messages.push({
      ...user,
      id: db.subjectMessageList.messages.length + 1,
    })
    console.log("user",user, db.subjectMessageList.messages);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),

   //Lab Diagnostics APIS
   http.get(('/api'+GET_LABDIAGNOSTICS+'/:id'), async ({ request }) => {
    // filter users
    let labdiagnostics = db.labdiagnostics;
    console.log("labdiagnostics", labdiagnostics); 

    return HttpResponse.json({  appointments }, { status: 202 });
  }),

   //Appointment APIS
   http.get(('/api'+GET_APPOINTMENTS+'/:id'), async ({ request }) => {
    // filter users
    let appointments = db.appointments;
    console.log("appointments", appointments); 

    return HttpResponse.json({  appointments }, { status: 202 });
  }),
  http.get(('/api'+GET_FILTERED_APPOINTMENT), async ({ request }) => {
    let appointments = db.appointments
    console.log("appointments", appointments); 

    return HttpResponse.json({  appointments }, { status: 202 });
  }),
  http.post(('/api'+STORE_NEW_APPOINTMENT), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.practitioner= 'Zee',
      user.practitioner_id= 1,
      user.patient= 'David David',
      user.patient_id= 1,
      user.date= '2024-10-17',
      user.start_time= '08:00 pm',
      user.end_time= '08:15 pm',
      user.status= 'TENTATIVE',
      user.service= 'Test',
      user.location= 'TKO Wellness',
      user.room= 'room 1',
      user.appointment_type= 'FOLLOW_UP',
      user.payment_type= 'Cash Only',
      user.notes= 'here is test appt',
    db.appointments.push({
      ...user,
      id: db.appointments.length + 1,
    })
    console.log("user",user, db.appointments);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_EMAIL_LIST), async ({ request }) => {
    // filter users
    let emailList = db.emailList;
    console.log("filterUserMangementList", emailList); 

    return HttpResponse.json({  emailList }, { status: 202 });
    
   }),
   http.post(('/api'+ADD_EMAIL_API), async ({ request }) => {
     const user = await request.json();
     const now = new Date();  
    
     // Format the date to "MM/DD/YYYY HH:mm"  
     const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;  
     user.date = formattedDate
     user.provider = "John Doe",
       console.log(user)
    db.emailList.push({
      ...user,
      id: db.emailList.length + 1,
      subject_id:db.emailList.length + 1,
    })
    console.log("user",user, db.emailList);
    
    //await store.dispatch('setMessageList',db.messageList);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_EMAIL_MESSAGE_BY_SUBJECT+'/:id'), async ({ request }) => {
    // filter users
    let subjectEmailList = db.subjectEmailList;
    console.log("subjectMessageList", subjectEmailList); 

    return HttpResponse.json({  subjectEmailList }, { status: 202 });
    
   }),
   http.post(('/api'+STORE_LABDIAGONOSTICS), async ({ request }) => {
    const user = await request.json();

    // Now, let's structure the payload
    const payload = {
      practitioner_id: 1,
      location: 'TKO Wellness',
      lab: 'LabCorp',
      courtesy: {
        copy: null,
        fax_number: null,
        fax_attn: null,
        account_attn: null,
      },
      payer: null,
      includeSecIns: null,
      isWorkersComp: null,
      orderPSC: null,
      DiagnosisCode: {
        diagnosisCode: null,
        diagnosticTests: null,
      },
      orderDetails: {
        priority: null,
        collectionDateTime: null,
        collectionDate: null,
        specimenSource: null,
        relevantClinicalInfo: null,
        notes: null,
        sourceSiteDetails: null,
        race: null,
        hispanicHeritage: null,
        specimenActionCode: null,
        height: null,
        weight: null,
        volume: null,
      },
      maternalScreening: {
        insulinDependent: null,
        numberOfFetuses: null,
        otherIndications: null,
        additionalInfo: '',
        donorEgg: null,
        ageOfDonor: '',
        typeOfEggDonor: null,
        gestationalAgeWeeks: '',
        gestationalAgeDays: '',
        gestationalAgeDecimal: '',
        gestationalAgeDate: '',
        crownRumpLength: '',
        sonographerLastName: '',
        sonographerFirstName: '',
        sonographerId: '',
        nuchalTranslucency: '',
        nuchalTranslucencyTwinB: '',
      },
      bethesdaCytology: {
        cervix: null,
        endocervix: null,
        labiaVulva: null,
        vagina: null,
        endometrium: null,
        labiumMajus: null,
        labiumMinus: null,
        vulva: null,
        lmpMenoDate: '',
        none: null,
        coniza: null,
        colpBX: null,
        laserVap: null,
        cryo: null,
        radiation: null,
        datesResults: '',
        pregnant: null,
        lactating: null,
        oralContraceptives: null,
        menopausal: null,
        swabSpatula: null,
        brushSpatula: null,
        spatulaAlone: null,
        brushAlone: null,
        broomAlone: null,
        otherCollectionTechnique: null,
        estroRX: null,
        pmpBleeding: null,
        postPart: null,
        iud: null,
        allOtherPat: null,
        negative: null,
        atypical: null,
        caInSitu: null,
        invasive: null,
        otherPreviousInfo: null,
        hysterectomyTotal: null,
        hysterectomyPartial: null,
        dysplasiaLow: null,
        dysplasiaHigh: null,
      },
      includeElectronicSignature: false,
      printOrderDetails: false,
      emailOrderDetails: false,
      shareRequisitionOnPatientPortal: false,
    };

    // You can now add this payload to the user object
    Object.assign(user, payload);

    db.labdiagnostics.push({
      ...user,
      id: db.labdiagnostics.length + 1,
    })
    console.log("labdiagnostics",user, db.labdiagnostics);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_INTAKE_QUESTIONS), async ({ request }) => {
    // filter users
    let intakeQuestions = db.intakeQuestions;
    console.log("intakeQuestions", intakeQuestions); 

    return HttpResponse.json({  intakeQuestions }, { status: 202 });
  }),
  http.post(('/api'+STORE_INTAKE_QUESTIONS), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.name= 'Weight Loss',
      user.description= 'Some text here',
      user.status= true,
      user.data = {}
    db.intakeQuestions.push({
      ...user,
      id: db.intakeQuestions.length + 1,
    })
    console.log("intakeQuestions",user, db.intakeQuestions);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_INTAKE_QUESTION_BY_ID+'/:id'), async ({ request }) => {
    // filter users
    let intakeQuestion = db.intakeQuestion;

    return HttpResponse.json({  intakeQuestion }, { status: 202 });
  }),
  http.post(('/api'+UPDATE_INTAKE_QUESTION_BY_ID+'/:id'), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.name= 'Weight Loss',
      user.description= 'Some text here',
      user.status= true,
      user.data = {}
    db.intakeQuestions.push({
      ...user,
      id: db.intakeQuestions.length + 1,
    })
    console.log("intakeQuestions",user, db.intakeQuestions);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.delete(`/api${DELETE_INTAKE_QUESTION_BY_ID}/:id`, ({ params }) => {
    const userId = Number(params.id)
    const userIndex = db.intakeQuestions.findIndex(e => e.id === userId)
    if (userIndex === -1) {
      return HttpResponse.json('Record not found', { status: 404 })
    }
    else {
      db.intakeQuestions.splice(userIndex, 1)
      
      return new HttpResponse(null, {
        status: 204,
      })
    }
  }),
  http.get(('/api'+GET_INTAKE_FORMS_LIST), async ({ request }) => {
    // filter users
    let intakeForms = db.intakeForms;
    console.log("intakeForms", intakeForms); 

    return HttpResponse.json({  intakeForms }, { status: 202 });
  }),
  http.get((`/api${GET_INTAKE_FORM_DATA}/:id`), async ({ request }) => {
    // filter users
    let intakeFormData = db.intakeFormData;
    console.log("intakeFormData", intakeFormData); 

    return HttpResponse.json({  intakeFormData }, { status: 202 });
  }),
  http.post((`/api${STORE_INTAKE_FORM_DATA}/:id`), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.uuid = '9d58c21c-87d8-456c-af1c-7f190bb90e2e'
      user.data = {}
    db.intakeFormData.push({
      ...user,
      id: db.intakeFormData.length + 1,
    })
    console.log("intakeFormData",user, db.intakeFormData);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
  http.get(`/api${STORE_INTAKE_FORM_DATA}/:id/:uuid`, async ({ request }) => {
    // Filter users
    let patientIntakeFormData = db.patientIntakeFormData;
    console.log("patientIntakeFormData", patientIntakeFormData); 

    return HttpResponse.json({ patientIntakeFormData }, { status: 202 });
  }),
  http.get(('/api'+GET_QUESTIONER_QUESTIONS), async ({ request }) => {
    // filter users
    let questionerQuestions = db.questionerQuestions;
    console.log("questionerQuestions", questionerQuestions); 

    return HttpResponse.json({  questionerQuestions }, { status: 202 });
  }),
  http.post(('/api'+STORE_QUESTIONER_QUESTIONS), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.name= 'Weight Loss',
      user.description= 'Some text here',
      user.status= true,
      user.data = {}
    db.questionerQuestions.push({
      ...user,
      id: db.questionerQuestions.length + 1,
    })
    console.log("questionerQuestions",user, db.questionerQuestions);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.get(('/api'+GET_QUESTIONER_QUESTION_BY_ID+'/:id'), async ({ request }) => {
    // filter users
    let questionerQuestion = db.questionerQuestion;

    return HttpResponse.json({  questionerQuestion }, { status: 202 });
  }),
  http.post(('/api'+UPDATE_QUESTIONER_QUESTION_BY_ID+'/:id'), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.name= 'Weight Loss',
      user.description= 'Some text here',
      user.status= true,
      user.data = {}
    db.questionerQuestions.push({
      ...user,
      id: db.questionerQuestions.length + 1,
    })
    console.log("questionerQuestions",user, db.questionerQuestions);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
   http.delete(`/api${DELETE_QUESTIONER_QUESTION_BY_ID}/:id`, ({ params }) => {
    const userId = Number(params.id)
    const userIndex = db.questionerQuestions.findIndex(e => e.id === userId)
    if (userIndex === -1) {
      return HttpResponse.json('Record not found', { status: 404 })
    }
    else {
      db.questionerQuestions.splice(userIndex, 1)
      
      return new HttpResponse(null, {
        status: 204,
      })
    }
  }),
  http.get(('/api'+GET_QUESTIONER_FORMS_LIST), async ({ request }) => {
    // filter users
    let questionerForms = db.questionerForms;
    console.log("questionerForms", questionerForms); 

    return HttpResponse.json({  questionerForms }, { status: 202 });
  }),
  http.get((`/api${GET_QUESTIONER_FORM_DATA}/:id`), async ({ request }) => {
    // filter users
    let questionerFormData = db.questionerFormData;
    console.log("questionerFormData", questionerFormData); 

    return HttpResponse.json({  questionerFormData }, { status: 202 });
  }),
  http.post((`/api${STORE_QUESTIONER_FORM_DATA}/:id`), async ({ request }) => {
    const user = await request.json();
      user.id= 1,
      user.uuid = '9d58c21c-87d8-456c-af1c-7f190bb90e2e'
      user.data = {}
    db.questionerFormData.push({
      ...user,
      id: db.questionerFormData.length + 1,
    })
    console.log("questionerFormData",user, db.questionerFormData);
    
    //await store.dispatch('setMessageSubject',db.subjectMessageList.messages);
    return HttpResponse.json({ body: user }, { status: 201 })
   }),
  http.get(`/api${STORE_QUESTIONER_FORM_DATA}/:id/:uuid`, async ({ request }) => {
    // Filter users
    let patientQuestionerFormData = db.patientQuestionerFormData;
    console.log("patientQuestionerFormData", patientQuestionerFormData); 

    return HttpResponse.json({ patientQuestionerFormData }, { status: 202 });
  }),

]

//   http.get(('/api'+INVENTORY_API), ({ request }) => {
//     // console.log('getalluser');
//     const url = new URL(request.url)
//     const q = url.searchParams.get('q')
//     // const role = url.searchParams.get('role')
//     // const plan = url.searchParams.get('plan')
//     // const status = url.searchParams.get('status')
//     const sortBy = url.searchParams.get('sortBy')
//     const itemsPerPage = url.searchParams.get('itemsPerPage')
//     const page = url.searchParams.get('page')
//     const orderBy = url.searchParams.get('orderBy')
//     const searchQuery = is.string(q) ? q : undefined
//     const queryLower = (searchQuery ?? '').toString().toLowerCase()
//     const parsedSortBy = destr(sortBy)
//     const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
//     const parsedOrderBy = destr(orderBy)
//     const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
//     const parsedItemsPerPage = destr(itemsPerPage)
//     const parsedPage = destr(page)
//     const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
//     const pageLocal = is.number(parsedPage) ? parsedPage : 1
//     // filter users
//     let filteredUsers = db.inventory;

//     // // sort users
//     // if (sortByLocal) {
//     //   console.log(sortByLocal)
//     //   if (sortByLocal === 'user') {
//     //     filteredUsers = filteredUsers.sort((a, b) => {
//     //       if (orderByLocal === 'asc')
//     //         return a.fullName.localeCompare(b.fullName)
//     //       else
//     //         return b.fullName.localeCompare(a.fullName)
//     //     })
//     //   }
//     //   if (sortByLocal === 'email') {
//     //     filteredUsers = filteredUsers.sort((a, b) => {
//     //       if (orderByLocal === 'asc')
//     //         return a.email.localeCompare(b.email)
//     //       else
//     //         return b.email.localeCompare(a.email)
//     //     })
//     //   }
//     // }
//     const totalUsers = filteredUsers.length

//     // total pages
//     const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)
    
//     return HttpResponse.json({
//       users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
//       totalPages,
//       totalUsers,
//       page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
//     }, { status: 200 })
//   }),
 

/*=========================================================================================
  File Name: moduleChatState.js
  Description: Chat Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {

  // Chat Search Query
  chatSearchQuery: '',

  // Stores All Contacts
  contacts: [
    {
      uid: 1,
      displayName: 'Felecia Rower',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      photoURL: require('@/assets/images/portrait/small/avatar-s-1.jpg'),
      status: 'offline'
    },
    {
      uid: 2,
      displayName: 'Adalberto Granzin',
      about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-2.jpg'),
      status: 'do not disturb'
    },
    {
      uid: 3,
      displayName: 'Joaquina Weisenborn',
      about: 'Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-3.jpg'),
      status: 'do not disturb'
    },
    {
      uid: 4,
      displayName: 'Verla Morgano',
      about: 'Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-4.jpg'),
      status: 'online'
    },
    {
      uid: 5,
      displayName: 'Margot Henschke',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      photoURL: require('@/assets/images/portrait/small/avatar-s-5.jpg'),
      status: 'do not disturb'
    },
    {
      uid: 6,
      displayName: 'Sal Piggee',
      about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-6.jpg'),
      status: 'online'
    },
    {
      uid: 7,
      displayName: 'Miguel Guelff',
      about: 'Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-7.jpg'),
      status: 'online'
    },
    {
      uid: 8,
      displayName: 'Mauro Elenbaas',
      about: 'Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-8.jpg'),
      status: 'away'
    },
    {
      uid: 9,
      displayName: 'Bridgett Omohundro',
      about: 'Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.',
      photoURL: require('@/assets/images/portrait/small/avatar-s-9.jpg'),
      status: 'offline'
    },
    {
      uid: 10,
      displayName: 'Zenia Jacobs',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      photoURL: require('@/assets/images/portrait/small/avatar-s-10.jpg'),
      status: 'away'
    }
  ],

  // Stores Chat Contacts
  chatContacts: [],

  // Stores Chat data(log)
  chats: {}
}

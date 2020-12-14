import {INavData} from '@coreui/angular';
import {WebConstants} from "./shared/constants/constants";

let userInfo = []

try {
  userInfo = JSON.parse(localStorage.getItem(WebConstants.USER_INFO))
} catch (e) {
  userInfo = []
}

const checkPermission = (KEY) => {
  if (userInfo === null) {
    return 'd-none';
  }
  const check = userInfo.findIndex(x => x.code === `GET_${KEY}`)
  if (check < 0) {
    return 'd-none';
  }
  return '';
};


export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    },
    class: checkPermission('DASHBOARD')
  },
  {
    name: 'User',
    url: '/user',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List User',
        url: '/user',
        icon: 'icon-list'
      }
    ],
    class: checkPermission('USER')
  },
  {
    name: 'Role',
    url: '/role',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List Role',
        url: '/role',
        icon: 'icon-list'
      }
    ],
    class: checkPermission('ROLE')
  },
  {
    name: 'Product',
    url: '/product',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List Product',
        url: '/product',
        icon: 'icon-list'
      }
    ],
    class: checkPermission('PRODUCT')
  },
  {
    name: 'Order',
    url: '/order',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List Order',
        url: '/order',
        icon: 'icon-list'
      }
    ],
    class: checkPermission('ORDER')
  },
];

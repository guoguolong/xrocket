var categories = [
  {
    id: 1, name: 'MENS', title: 'MENS', parentId: 0, level: 1, children: [
      { id: 10, name: 'T-Shirts', title: 'MEN\'S T-SHIRTS', parentId: 1, level: 2 },
      { id: 11, name: 'Outerwear', title: 'MEN\'S OUTERWEAR', parentId: 1, level: 2 },
    ]
  },
  {
    id: 2, name: 'WOMENS', title: 'WOMENS', parentId: 0, level: 1, children: [
      { id: 20, name: 'T-Shirts', title: 'WOMEN\'S T-SHIRTS', parentId: 2, level: 2 },
      { id: 21, name: 'Outerwear', title: 'WOMEN\'S OUTERWEAR', parentId: 2, level: 2 },
    ]
  },
  {
    id: 3, name: 'KIDS', title: 'KIDS', parentId: 0, level: 1, children: [
      { id: 31, name: 'T-Shirts', title: 'KID\'S T-SHIRTS', parentId: 3, level: 2 },
      { id: 32, name: 'Outerwear', title: 'KID\'S OUTERWEAR', parentId: 3, level: 2 }
    ]
  },
  { id: 4, name: 'ACCESSORIES', title: 'ACCESSORIES', parentId: 0, level: 1 },
  { id: 5, name: 'PREMIUM', title: 'PREMIUM', parentId: 0, level: 1 },
];

module.exports = categories;
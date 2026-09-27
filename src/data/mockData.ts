import type { Category, Customer, Order, Product } from '../types';

export const products: Product[] = [
	{ id: 'PR-1048', name: 'Submariner Date', sku: '126610LN', category: 'Submariner', price: 368000000, stock: 12, status: 'Active', image: '/media/submariner.avif' },
	{ id: 'PR-1047', name: 'Datejust 36', sku: '126234-0017', category: 'Datejust', price: 312000000, stock: 8, status: 'Active', image: '/media/datejust%2036.avif' },
	{ id: 'PR-1046', name: 'Day-Date 40', sku: '228238-0004', category: 'Day-Date', price: 1248000000, stock: 3, status: 'Active', image: '/media/day-date%2040.avif' },
	{ id: 'PR-1045', name: 'Sea-Dweller', sku: '126600-0002', category: 'Sea-Dweller', price: 456000000, stock: 0, status: 'Draft', image: '/media/sea.avif' },
	{ id: 'PR-1044', name: 'Sky-Dweller', sku: '336934-0001', category: 'Sky-Dweller', price: 582000000, stock: 6, status: 'Active', image: '/media/sky-dweller.avif' },
	{ id: 'PR-1043', name: 'Deepsea', sku: '136660-0001', category: 'Deepsea', price: 492000000, stock: 2, status: 'Active', image: '/media/deepsea.avif' },
	{ id: 'PR-1042', name: 'Land-Dweller 40', sku: '127334-0001', category: 'Land-Dweller', price: 476000000, stock: 5, status: 'Active', image: '/media/Land-Dweller.avif' },
	{ id: 'PR-1041', name: 'Oyster Perpetual', sku: '124300-0007', category: 'Oyster Perpetual', price: 198000000, stock: 11, status: 'Archived', image: '/media/11610lv.avif' },
	{ id: 'PR-1040', name: 'Datejust 41', sku: '126334-0018', category: 'Datejust', price: 342000000, stock: 7, status: 'Active', image: '/media/116234.avif' },
	{ id: 'PR-1039', name: 'Submariner Date Green', sku: '126610LV', category: 'Submariner', price: 398000000, stock: 4, status: 'Active', image: '/media/sub%20date.avif' },
];

export const categories: Category[] = [
	{ id: 'CT-01', name: 'Submariner', slug: 'submariner', products: 18, status: 'Active' },
	{ id: 'CT-02', name: 'Datejust', slug: 'datejust', products: 24, status: 'Active' },
	{ id: 'CT-03', name: 'Day-Date', slug: 'day-date', products: 12, status: 'Active' },
	{ id: 'CT-04', name: 'Sea-Dweller', slug: 'sea-dweller', products: 9, status: 'Active' },
	{ id: 'CT-05', name: 'Sky-Dweller', slug: 'sky-dweller', products: 7, status: 'Hidden' },
	{ id: 'CT-06', name: 'Oyster Perpetual', slug: 'oyster-perpetual', products: 15, status: 'Active' },
];

export const customers: Customer[] = [
	{ id: 'CU-2048', name: 'Minh Anh Nguyễn', email: 'minhanh.nguyen@email.com', phone: '+84 908 123 456', joined: '2026-08-18', orders: 8, spent: 1248000000, initials: 'MA' },
	{ id: 'CU-2047', name: 'David Trần', email: 'david.tran@email.com', phone: '+84 912 660 889', joined: '2026-08-16', orders: 5, spent: 856000000, initials: 'DT' },
	{ id: 'CU-2046', name: 'Linh Phạm', email: 'linh.pham@email.com', phone: '+84 903 441 222', joined: '2026-08-12', orders: 3, spent: 524000000, initials: 'LP' },
	{ id: 'CU-2045', name: 'Hoàng Lê', email: 'hoang.le@email.com', phone: '+84 987 090 128', joined: '2026-08-09', orders: 4, spent: 468000000, initials: 'HL' },
	{ id: 'CU-2044', name: 'Hương Đỗ', email: 'huong.do@email.com', phone: '+84 909 881 090', joined: '2026-08-02', orders: 2, spent: 312000000, initials: 'HĐ' },
	{ id: 'CU-2043', name: 'Quốc Bảo Vũ', email: 'quocbao.vu@email.com', phone: '+84 936 772 615', joined: '2026-07-29', orders: 6, spent: 968000000, initials: 'BV' },
	{ id: 'CU-2042', name: 'Thảo Võ', email: 'thao.vo@email.com', phone: '+84 916 556 201', joined: '2026-07-25', orders: 1, spent: 198000000, initials: 'TV' },
	{ id: 'CU-2041', name: 'Richard Nguyễn', email: 'richard.nguyen@email.com', phone: '+84 938 441 100', joined: '2026-07-19', orders: 9, spent: 1842000000, initials: 'RN' },
	{ id: 'CU-2040', name: 'Mai Trương', email: 'mai.truong@email.com', phone: '+84 901 882 330', joined: '2026-07-14', orders: 2, spent: 456000000, initials: 'MT' },
];

export const orders: Order[] = [
	{ id: 'OR-90384', customer: 'Minh Anh Nguyễn', email: 'minhanh.nguyen@email.com', date: '2026-09-26', total: 368000000, status: 'Processing', items: [{ product: 'Submariner Date', quantity: 1, price: 368000000 }] },
	{ id: 'OR-90383', customer: 'David Trần', email: 'david.tran@email.com', date: '2026-09-25', total: 624000000, status: 'Shipped', items: [{ product: 'Datejust 36', quantity: 2, price: 312000000 }] },
	{ id: 'OR-90382', customer: 'Linh Phạm', email: 'linh.pham@email.com', date: '2026-09-25', total: 1248000000, status: 'Delivered', items: [{ product: 'Day-Date 40', quantity: 1, price: 1248000000 }] },
	{ id: 'OR-90381', customer: 'Hoàng Lê', email: 'hoang.le@email.com', date: '2026-09-24', total: 456000000, status: 'Processing', items: [{ product: 'Sea-Dweller', quantity: 1, price: 456000000 }] },
	{ id: 'OR-90380', customer: 'Hương Đỗ', email: 'huong.do@email.com', date: '2026-09-23', total: 582000000, status: 'Shipped', items: [{ product: 'Sky-Dweller', quantity: 1, price: 582000000 }] },
	{ id: 'OR-90379', customer: 'Quốc Bảo Vũ', email: 'quocbao.vu@email.com', date: '2026-09-22', total: 492000000, status: 'Cancelled', items: [{ product: 'Deepsea', quantity: 1, price: 492000000 }] },
	{ id: 'OR-90378', customer: 'Thảo Võ', email: 'thao.vo@email.com', date: '2026-09-21', total: 198000000, status: 'Delivered', items: [{ product: 'Oyster Perpetual', quantity: 1, price: 198000000 }] },
	{ id: 'OR-90377', customer: 'Richard Nguyễn', email: 'richard.nguyen@email.com', date: '2026-09-20', total: 476000000, status: 'Delivered', items: [{ product: 'Land-Dweller 40', quantity: 1, price: 476000000 }] },
	{ id: 'OR-90376', customer: 'Mai Trương', email: 'mai.truong@email.com', date: '2026-09-19', total: 398000000, status: 'Processing', items: [{ product: 'Submariner Date Green', quantity: 1, price: 398000000 }] },
	{ id: 'OR-90375', customer: 'Minh Anh Nguyễn', email: 'minhanh.nguyen@email.com', date: '2026-09-18', total: 342000000, status: 'Delivered', items: [{ product: 'Datejust 41', quantity: 1, price: 342000000 }] },
];

export const revenueSeries = [
	{ label: '01 Sep', revenue: 1.8, orders: 12 }, { label: '04 Sep', revenue: 2.7, orders: 18 },
	{ label: '07 Sep', revenue: 2.1, orders: 15 }, { label: '10 Sep', revenue: 3.5, orders: 24 },
	{ label: '13 Sep', revenue: 2.9, orders: 19 }, { label: '16 Sep', revenue: 4.1, orders: 28 },
	{ label: '19 Sep', revenue: 3.4, orders: 22 }, { label: '22 Sep', revenue: 4.8, orders: 32 },
	{ label: '25 Sep', revenue: 4.2, orders: 29 },
];

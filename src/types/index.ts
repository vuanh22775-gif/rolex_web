export type Theme = 'light' | 'dark';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type ProductStatus = 'Active' | 'Draft' | 'Archived';

export interface Product {
	id: string;
	name: string;
	sku: string;
	category: string;
	model?: string;
	price: number;
	stock: number;
	status: ProductStatus;
	image: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	products: number;
	status: 'Active' | 'Hidden';
}

export interface OrderItem {
	product: string;
	sku?: string;
	quantity: number;
	price: number;
}

export interface Order {
	id: string;
	customer: string;
	email: string;
	date: string;
	total: number;
	status: OrderStatus;
	items: OrderItem[];
}

export interface Customer {
	id: string;
	name: string;
	email: string;
	phone: string;
	joined: string;
	orders: number;
	spent: number;
	initials: string;
}

export interface ToastMessage {
	id: string;
	title: string;
	description?: string;
	tone: 'success' | 'error' | 'info';
}

import { Mail, Home, User, Package, DollarSign, BarChart } from "react-feather";

export default [
	{
		id: "Products",
		title: "Products",
		icon: <Package size={20} />,
		navLink: "/home",
	},
	{
		id: "Transactions",
		title: "Transactions",
		icon: <DollarSign size={20} />,
		navLink: "/transactions",
	},
	{
		id: "Charts",
		title: "Charts",
		icon: <BarChart size={20} />,
		navLink: "/charts",
	},
];

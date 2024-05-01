import { Mail, Home, Package } from "react-feather";

export default [
	{
		id: "Products",
		title: "Products",
		icon: <Package size={20} />,
		navLink: "/home",
	},
	{
		id: "secondPage",
		title: "Second Page",
		icon: <Mail size={20} />,
		navLink: "/second-page",
	},
];

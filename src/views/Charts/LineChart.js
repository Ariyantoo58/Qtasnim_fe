// ** Third Party Components
import { Calendar } from "react-feather";
import Flatpickr from "react-flatpickr";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
} from "recharts";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";

// ** Chart Data
// const data = [
// 	{
// 		name: "7/12",
// 		sales: 20,
// 	},
// 	{
// 		name: "8/12",
// 		sales: 40,
// 	},
// 	{
// 		name: "9/12",
// 		sales: 30,
// 	},
// 	{
// 		name: "10/12",
// 		sales: 70,
// 	},
// 	{
// 		name: "11/12",
// 		sales: 40,
// 	},
// 	{
// 		name: "12/12",
// 		sales: 60,
// 	},
// 	{
// 		name: "13/12",
// 		sales: 50,
// 	},
// 	{
// 		name: "14/12",
// 		sales: 140,
// 	},
// 	{
// 		name: "15/12",
// 		sales: 120,
// 	},
// 	{
// 		name: "16/12",
// 		sales: 100,
// 	},
// 	{
// 		name: "17/12",
// 		sales: 140,
// 	},
// 	{
// 		name: "18/12",
// 		sales: 180,
// 	},
// 	{
// 		name: "19/12",
// 		sales: 220,
// 	},
// ];

const CustomTooltip = (data) => {
	console.log(data, "dataa");
	if (data.active && data.payload) {
		return (
			<div className="recharts-custom-tooltip">
				<p className="fw-bold mb-0">{data.label}</p>
				<p className="fw-bold mb-0">#ID TS-{data.payload[0]?.payload.id}</p>
				<p className="fw-bold mb-0">
					Tanggal{" "}
					{moment(data.payload[0]?.payload.tanggal).format("DD-MM-YYYY")}
				</p>
				<hr />
				<div className="active">
					{data.payload.map((i) => {
						return (
							<div className="d-flex align-items-center" key={i.dataKey}>
								<span
									className="bullet bullet-sm bullet-bordered me-50"
									style={{
										backgroundColor: i.fill,
									}}
								></span>
								<span className="text-capitalize me-75">
									{i.dataKey} : {i.payload[i.dataKey]}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return null;
};

const SimpleAreaChart = () => {
	const [data, setData] = useState();
	const getTransactions = async () => {
		const response = await axios.get(
			"http://localhost:8001/transactions/grouping"
		);

		const dataMap = response.data.data.map(
			({ jumlah, product, transaksi }) => ({
				name: product.name,
				terjual: jumlah,
				...transaksi,
			})
		);
		setData(dataMap);
	};

	const handleType = async (e) => {
		const response = await axios.get(
			`http://localhost:8001/transactions/grouping?type=${e.value}`
		);
		console.log(response, "responsed");
		const dataMap = response.data.data.map(
			({ jumlah, product, transaksi }) => ({
				name: product.name,
				terjual: jumlah,
				...transaksi,
			})
		);
		setData(dataMap);
	};

	const handlePicker = async (e) => {
		const response = await axios.get(
			`http://localhost:8001/transactions/grouping?from=${e[0]}&to=${e[1]}`
		);
		console.log(e, "responsed");
		const dataMap = response.data.data.map(
			({ jumlah, product, transaksi }) => ({
				name: product.name,
				terjual: jumlah,
				...transaksi,
			})
		);
		setData(dataMap);
	};

	useEffect(() => {
		getTransactions();
	}, []);
	return (
		<Card>
			<CardHeader className="flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-sm-center align-items-start">
				<CardTitle tag="h4">Data Terjual</CardTitle>
				<div>
					<Select
						options={[
							{
								value: "MAX",
								label: "Terjual Terbanyak",
							},
							{
								value: "MIN",
								label: "Terjual Tersedikit",
							},
						]}
						defaultValue={[
							{
								value: "MAX",
								label: "Terjual Terbanyak",
							},
						]}
						onChange={(e) => handleType(e)}
					/>
				</div>
				<div className="d-flex align-items-center">
					<Calendar size={15} />
					<Flatpickr
						className="form-control flat-picker bg-transparent border-0 shadow-none"
						onChange={(e) => handlePicker(e)}
						options={{
							mode: "range",
							// eslint-disable-next-line no-mixed-operators
							defaultDate: [
								new Date(),
								new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
							],
						}}
					/>
				</div>
			</CardHeader>

			<CardBody>
				<div className="d-flex align-items-center mb-2">
					<div className="me-2">
						<span
							className="bullet bullet-sm bullet-bordered me-50"
							style={{ backgroundColor: "rgba(115, 103, 240, .5)" }}
						></span>
						<span className="align-middle me-75">Penjualan</span>
					</div>
				</div>
				<div className="recharts-wrapper">
					<ResponsiveContainer>
						<LineChart height={400} data={data}>
							<CartesianGrid />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip content={CustomTooltip} />
							<Area
								dataKey="terjual"
								stackId="terjual"
								stroke="0"
								fill="rgba(115, 103, 240, .5)"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardBody>
		</Card>
	);
};
export default SimpleAreaChart;

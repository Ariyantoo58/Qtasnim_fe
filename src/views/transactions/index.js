// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { Plus, Search } from "react-feather";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import UILoader from "@components/ui-loader";
import {
	Table,
	Button,
	CardBody,
	Card,
	CardFooter,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Input,
	Label,
	Row,
	Col,
	Badge,
} from "reactstrap";

import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const CustomHeader = ({
	setSearchTerm,
	searchTerm,
	handleSearch,
	handleSort,
	handleTypeSort,
	handlePicker,
}) => {
	return (
		<div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
			<Row>
				<Col xl="6" className="d-flex align-items-center p-0">
					<div className="d-flex align-items-center w-100">
						<label htmlFor="rows-per-page">Show</label>
						<Input
							className="mx-100"
							type="select"
							id="rows-per-page"
							// value={rowsPerPage}
							onChange={handleSort}
							style={{ width: "10rem" }}
						>
							<option value="tanggal">Tanggal Transaksi</option>
							<option value="name">Nama</option>
						</Input>
						<Input
							className="mx-100"
							type="select"
							id="rows-per-page"
							// value={rowsPerPage}
							onChange={handleTypeSort}
							style={{ width: "10rem" }}
						>
							<option value="ASC">Ascending</option>
							<option value="DESC">Descending</option>
						</Input>
					</div>
				</Col>
				<Col
					xl="6"
					className="d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pe-lg-1 p-0 mt-lg-0 mt-1"
				>
					<div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
						<label className="mb-0" htmlFor="search-invoice">
							Search:
						</label>
						<Input
							type="text"
							value={searchTerm}
							id="search-invoice"
							className="ms-50 w-100"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Button onClick={handleSearch} color="info">
							<Search size={17} />
						</Button>
					</div>

					{/* <Col md={20} className="d-flex align-items-center mb-sm-0 mb-1 me-1">
						<label className="mb-0 me-1" htmlFor="search-invoice">
							Periode:
						</label>
						<Input
							id="range-picker"
							type="date"
							className="form-control"
							onChange={(date) => handlePicker(date)}
						/>
					</Col> */}
				</Col>
			</Row>
		</div>
	);
};

export default function Transactions() {
	const [open, setOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [jumlah, setJumlah] = useState("");
	const [item, setItem] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState([]);
	const [sort, setSort] = useState("");
	const [typeSort, setTypeSort] = useState("");
	const [prodOption, setProdOption] = useState([]);
	const [product, setProduct] = useState([]);
	const [dataSubmit, setDataSubmit] = useState({});
	const [searchTerm, setSearchTerm] = useState("");
	const [picker, setPicker] = useState("");

	console.log(product, "productss");

	const navigate = useNavigate();

	const getProducts = async () => {
		const response = await axios.get("http://localhost:8001/products");
		const dataOption = response.data.data.map(({ id, name, stok }) => ({
			value: id,
			label: name,
			stock: stok,
		}));
		setProdOption(dataOption);
	};
	const getTransactions = async () => {
		const response = await axios.get("http://localhost:8001/transactions");
		setData(response.data.data);
	};
	const getSarch = async () => {
		const response = await axios.get(
			`http://localhost:8001/transactions?query=${searchTerm}&sort=${sort}&type=${typeSort}&picker=${picker}`
		);
		setData(response.data.data);
	};
	const handleAdd = () => {
		setJumlah("");
		setOpen(true);
		getProducts();
	};

	const toggleSidebar = () => {
		setOpen(!open);
	};
	const toggleSidebarEdit = () => {
		setOpenEdit(!openEdit);
	};

	const submitAdd = async (e) => {
		e.preventDefault();
		setDataSubmit({ ...product, jumlah: jumlah });
	};

	const handleDelete = async (id) => {
		const response = await axios.delete(
			`http://localhost:8001/transactions/${id}`
		);
		if (response.status === 200) {
			toast.success("delete success", { position: "top-center" });
			getTransactions();
		} else {
			toast.error("delete failed", { position: "top-center" });
		}
	};

	const handleEdit = async (item) => {
		setJumlah(item.jumlah);
		setItem(item);
		setOpenEdit(true);
	};

	const handleX = (index) => {
		const NewData = [...dataSubmit];
		NewData.splice(index, 1);
		setDataSubmit(NewData);
	};

	const handleSort = (e) => {
		setSort(e.target.value);
		getSarch();
	};
	const handleTypeSort = (e) => {
		setTypeSort(e.target.value);
		getSarch();
	};

	const handlePicker = (e) => {
		setPicker(e.target.value);
		getSarch();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await axios.post("http://localhost:8001/transactions", {
			...product,
			jumlah: jumlah,
		});

		if (response.status === 200) {
			toast.success("add Succsess", { position: "top-center" });
			setDataSubmit([]);
			getTransactions();
			getProducts();
			toggleSidebar();
		} else {
			toast.error("errorr");
		}
	};

	const submitEdit = async (e) => {
		e.preventDefault();
		const response = await axios.put(
			`http://localhost:8001/transactions/${item.id}`,
			{
				jumlah: jumlah,
				productId: product.value,
			}
		);
		if (response.status === 200) {
			toast.success("update success", { position: "top-center" });

			getTransactions();
			getProducts();
		} else {
			toast.error("update failed", { position: "top-center" });
		}
		toggleSidebarEdit();
	};

	const columns = [
		{
			name: "Name",
			sortable: true,
			maxWidth: "150px",
			selector: ({ id }) => id,
			cell: ({ product }) => (
				<Link>
					<b>{product.name}</b>
				</Link>
			),
		},
		{
			name: "Stok",
			sortable: true,
			maxWidth: "50px",
			selector: ({ id }) => id,
			cell: ({ transaksi }) => (
				<div>
					<b>{transaksi.lastStok}</b>
				</div>
			),
		},
		{
			name: "Jumlah terjual",
			sortable: true,
			maxWidth: "150px",
			selector: ({ id }) => id,
			cell: ({ jumlah }) => (
				<div>
					<b>{jumlah}</b>
				</div>
			),
		},
		{
			name: "ID Transaksi",
			sortable: true,
			maxWidth: "150px",
			selector: ({ id }) => id,
			cell: ({ transaksi }) => (
				<div>
					<b>#TS-{transaksi.id}</b>
				</div>
			),
		},
		{
			name: "Tanggal Transaksi",
			sortable: true,
			maxWidth: "200px",
			selector: ({ id }) => id,
			cell: ({ transaksi }) => (
				<div>
					<b> {moment(transaksi.tanggal).format("DD-MM-YYYY")}</b>
				</div>
			),
		},
		{
			name: "Jenis Barang",
			sortable: true,
			maxWidth: "150px",
			selector: ({ id }) => id,
			cell: ({ product }) => (
				<div>
					<b>{product.jenis}</b>
				</div>
			),
		},
		{
			name: "Action",
			sortable: true,
			maxWidth: "300px",
			selector: ({ id }) => id,
			cell: (item) => (
				<div className="d-flex">
					<div className="h-20 btn">
						{" "}
						<Badge color="warning" onClick={() => handleEdit(item)}>
							Edit
						</Badge>
					</div>
					<div className="h-20 btn ">
						<Badge color="danger" onClick={() => handleDelete(item.id)}>
							Delete
						</Badge>
					</div>
				</div>
			),
		},
	];

	useEffect(() => {
		getTransactions();
		getProducts();
	}, []);

	return (
		<Fragment>
			<div className="d-flex justify-content-between">
				<div className="flex-1 w-50">
					<Breadcrumbs
						title="Transactions"
						data={[{ title: "Transactions" }]}
					/>
				</div>

				<div className="flex-1">
					<Button.Ripple color="primary" onClick={() => handleAdd()}>
						<Plus size={14} />
						<span className="align-middle ms-25">Add Transactions</span>
					</Button.Ripple>
				</div>
			</div>

			{/* Modal Add */}
			<Modal isOpen={open} toggle={toggleSidebar}>
				<ModalHeader>Add Transaction</ModalHeader>
				<ModalBody>
					<Form onSubmit={handleSubmit}>
						<div className=" d-flex gap-2 justify-content-between align-items-center mb-1">
							<div className="w-100">
								<Select
									type="text"
									placeholder="Products"
									required
									options={prodOption}
									onChange={(e) => setProduct(e)}
								/>
							</div>

							<Input
								type="number"
								placeholder={"Jumlah"}
								max={product.stock ? product.stock : 100}
								min={0}
								required
								onChange={(e) => setJumlah(e.target.value)}
							/>
							{product.length !== 0 ? (
								<Badge>stok: {product.stock}</Badge>
							) : (
								<></>
							)}
						</div>
						{/* {product.stock ? <div>ready stok {product.stock}</div> : <></>} */}

						{/* <div className="mt-10">
							<Table responsive striped hover>
								<thead>
									<tr key={"headTable"}>
										<th>Product</th>
										<th>Jumlah</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									{dataSubmit.map(({ jumlah, label, value }, index) => (
										<tr key={index}>
											<td>{label}</td>
											<td>{jumlah}</td>
											<td>
												<Button onClick={() => handleX(index)}>x</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div> */}
						<div className=" d-flex gap-2 justify-content-end align-items-center mb-1">
							<Button type="submit" color="info">
								Submit
							</Button>
						</div>
					</Form>
				</ModalBody>
			</Modal>

			{/* Modal Edit */}
			<Modal isOpen={openEdit} toggle={toggleSidebarEdit}>
				<ModalHeader>Add Transaction</ModalHeader>
				<ModalBody>
					<Form onSubmit={submitEdit}>
						<div className=" d-flex gap-2 justify-content-between align-items-center mb-1">
							<div className="w-100">
								<Select
									type="text"
									placeholder="Products"
									required
									options={prodOption}
									defaultValue={[
										{
											label: item.product?.name,
											value: item.product?.id,
										},
									]}
									onChange={(e) => setProduct(e)}
								/>
							</div>

							<Input
								type="number"
								placeholder={"Jumlah"}
								required
								defaultValue={item?.jumlah}
								onChange={(e) => setJumlah(e.target.value)}
							/>
						</div>
						{/* {product.stock ? <div>ready stok {product.stock}</div> : <></>} */}

						<div className=" d-flex gap-2 justify-content-end align-items-center mb-1">
							<Button type="submit" color="info">
								Submit
							</Button>
						</div>
					</Form>
				</ModalBody>
			</Modal>

			<Card>
				<CardBody>
					<UILoader>
						<div className="invoice-list-dataTable react-dataTable">
							<DataTable
								noHeader
								pagination
								paginationServer
								subHeader={true}
								columns={columns}
								responsive={true}
								data={data}
								className="react-dataTable"
								defaultSortField="invoiceId"
								paginationDefaultPage={1}
								// paginationComponent={CustomPagination}
								subHeaderComponent={
									<CustomHeader
										setSearchTerm={setSearchTerm}
										searchTerm={searchTerm}
										handleSearch={getSarch}
										handleSort={handleSort}
										handleTypeSort={handleTypeSort}
										handlePicker={handlePicker}
									/>
								}
								customStyles={{
									rows: {
										style: {
											backgroundColor: "#FFFFFF",
											"&:nth-child(2n)": {
												backgroundColor: "#f6f6fd",
											},
										},
									},
								}}
							/>
						</div>
					</UILoader>
				</CardBody>
				{/* <CardFooter>
					<ReactPaginate
						previousLabel={""}
						nextLabel={""}
						// pageCount={data.length}
						activeClassName="active"
						forcePage={currentPage !== 0 ? currentPage - 1 : 0}
						onPageChange={(page) => getCurrentStage(page.selected)}
						pageClassName={"page-item"}
						nextLinkClassName={"page-link"}
						nextClassName={"page-item next"}
						previousClassName={"page-item prev"}
						previousLinkClassName={"page-link"}
						pageLinkClassName={"page-link"}
						containerClassName={"pagination react-paginate  my-2 pe-1"}
					/>
				</CardFooter> */}
			</Card>
		</Fragment>
	);
}

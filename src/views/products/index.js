// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
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
} from "reactstrap";
import { Plus } from "react-feather";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

export default function Products() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [stock, setStock] = useState("");
	const [type, setType] = useState("");
	const [item, setItem] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState([]);
	const [jenis, setJenis] = useState("konsumsi");

	const getCurrentStage = () => {};

	const getProducts = async () => {
		const response = await axios.get("http://localhost:8001/products");
		setData(response.data.data);
	};
	const handleAdd = () => {
		setName("");
		setStock("");
		setType("add");
		setJenis("konsumsi");
		setOpen(true);
	};

	const toggleSidebar = () => {
		setOpen(!open);
	};

	const submitAdd = async (e) => {
		e.preventDefault();
		if (type === "add") {
			const response = await axios.post("http://localhost:8001/products", {
				name: name,
				stock: parseInt(stock),
				jenis: jenis,
			});
			if (response.status === 200) {
				toast.success("add Succsess", { position: "top-center" });
				getProducts();
			} else {
				toast.error("errorr");
			}
		}
		if (type === "edit") {
			const response = await axios.put(
				`http://localhost:8001/products/${item.id}`,
				{
					name: name,
					stock: parseInt(stock),
					jenis: jenis,
				}
			);
			if (response.status === 200) {
				toast.success("update Succsess", { position: "top-center" });
				getProducts();
			} else {
				toast.error("errorr");
			}
		}

		toggleSidebar();
	};

	const handleDelete = async (id) => {
		const response = await axios.delete(`http://localhost:8001/products/${id}`);
		if (response.status === 200) {
			toast.success("delete success", { position: "top-center" });
			getProducts();
		} else {
			toast.error("delete failed", { position: "top-center" });
		}
	};

	const handleEdit = async (item) => {
		setType("edit");
		setJenis(item.jenis);
		setName(item.name);
		setStock(item.stok);
		setItem(item);
		setOpen(true);
	};

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<Fragment>
			<div className="d-flex justify-content-between">
				<div className="flex-1 w-50">
					<Breadcrumbs title="Products" data={[{ title: "Products " }]} />
				</div>

				<div className="flex-1">
					<Button.Ripple color="primary" onClick={() => handleAdd()}>
						<Plus size={14} />
						<span className="align-middle ms-25">Add</span>
					</Button.Ripple>
				</div>
			</div>
			<Modal isOpen={open} toggle={toggleSidebar}>
				<ModalHeader>Modal</ModalHeader>
				<ModalBody>
					<Form onSubmit={submitAdd}>
						<div className="  align-items-center mb-1">
							<span className="title mr-10">Product Name</span>
							<Input
								type="text"
								placeholder={"Name"}
								required
								defaultValue={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="  align-items-center mb-1">
							<span className="title">Product Stok</span>
							<Input
								type="number"
								placeholder={"Stock"}
								defaultValue={stock}
								required
								onChange={(e) => setStock(e.target.value)}
							/>
						</div>
						<div className="  align-items-center mb-1">
							<span className="title">Jenis Product</span>
							<Select
								placeholder={"Jenis"}
								options={[
									{
										value: "konsumsi",
										label: "konsumsi",
									},
									{
										value: "pembersih",
										label: "pembersih",
									},
								]}
								required
								defaultValue={[
									{
										label: jenis,
										value: jenis,
									},
								]}
								onChange={(e) => setJenis(e.value)}
							/>
						</div>
						<Button type="submit" color="info">
							Submit
						</Button>
					</Form>
				</ModalBody>
			</Modal>

			<Card>
				<CardBody>
					<Table responsive striped hover>
						<thead>
							<tr key={"headTable"}>
								<th>Kode Product</th>
								<th>Name Product</th>
								<th>Stok</th>
								<th>Jenis</th>
								<th>Action</th>
							</tr>
						</thead>

						<tbody>
							{data.map((item, index) => (
								<tr key={index}>
									<td>{`KP${item.id}`}</td>

									<td>{item.name}</td>
									<td>{item.stok}</td>
									<td>{item.jenis}</td>
									<td>
										<div className="d-flex gap-2">
											<Button color="warning" onClick={() => handleEdit(item)}>
												Edit
											</Button>
											<Button
												color="danger"
												onClick={() => handleDelete(item.id)}
											>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
							<div style={{ height: 100 }}></div>
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</Fragment>
	);
}

// ** React Imports
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import {
  Table,
  Label,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody,
  Card,
  Spinner,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardFooter,
} from "reactstrap";
import { Plus } from "react-feather";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import View from "./users/view";

const data = [
  {
    name: "Linda",
    email: "Linda@mail.co",
    status: true,
    role: "admin",
  },
  {
    name: "Aziz",
    email: "Aziz@mail.co",
    status: true,
    role: "admin",
  },
  {
    name: "Siska",
    email: "Siska@mail.co",
    status: true,
    role: "admin",
  },
  {
    name: "Marsya",
    email: "Marsya@mail.co",
    status: false,
    role: "super admin",
  },
  {
    name: "Nana",
    email: "Nana@mail.co",
    status: true,
    role: "admin",
  },
];

export default function ListSalesOrder() {
  const [view, setView] = useState("list");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataView, setDataView] = useState([]);
  const getCurrentStage = () => {};

  const handleView = (val) => {
    setView("view");
    setDataView(val);
  };
  return view !== "list" ? (
    <View view={view} setView={setView} data={dataView} />
  ) : (
    <Fragment>
      <Breadcrumbs title="Account" data={[{ title: "Account " }]} />

      <Card>
        <CardBody>
          <Table responsive striped hover>
            <thead>
              <tr key={"headTable"}>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{`${item.status}`}</td>

                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button color="info" onClick={() => handleView(item)}>
                        Detail
                      </Button>
                      <Button color="warning">Edit</Button>
                      <Button color="danger">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              <div style={{ height: 100 }}></div>
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            pageCount={data.length}
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
        </CardFooter>
      </Card>
    </Fragment>
  );
}

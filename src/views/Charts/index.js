// ** React Imports
import { Fragment, useContext } from "react";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
import AreaChart from "./AreaChart";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/charts/recharts.scss";

const Charts = () => {
	const { colors } = useContext(ThemeColors);
	return (
		<Fragment>
			<Breadcrumbs title="Charts" data={[{ title: "Charts" }]} />

			<Row className="match-height">
				<Col sm="12">
					<AreaChart primary={colors.primary.main} />
				</Col>
			</Row>
		</Fragment>
	);
};

export default Charts;

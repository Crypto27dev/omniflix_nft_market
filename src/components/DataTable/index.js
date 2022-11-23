import MUIDataTable from 'mui-datatables';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

const DataTable = (props) => {
    return (
        <MUIDataTable
            columns={props.columns}
            data={props.data}
            options={props.options}
            title={props.name}/>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
};

export default DataTable;

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";

import React, { useMemo } from "react";
import SortableTableHead from "./SortableTableHead";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  // table: {
  //   minWidth: 750,
  // },
  avatar: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  title: {
    padding: theme.spacing(2),
  },
  cell: {
    borderBottom: "1px solid rgba(43, 43, 43, 0.435) !important"
  },
}));

const liquidityPairOverrides = ['reserve0', 'reserve1'];
function descendingComparator(a, b, orderBy) {
  if (a.__typename === 'Pool') {
    if (liquidityPairOverrides.includes(orderBy)) {
      a = a.liquidityPair;
      b = b.liquidityPair;
    }
    if (orderBy === 'name') {
      a = { name: `${a.liquidityPair.token0.symbol}-${a.liquidityPair.token1.symbol}` };
      b = { name: `${b.liquidityPair.token0.symbol}-${b.liquidityPair.token1.symbol}` };
    }
  }
  a = Number.isNaN(parseFloat(a[orderBy]))
    ? a[orderBy]
    : parseFloat(a[orderBy]);
  b = Number.isNaN(parseFloat(b[orderBy]))
    ? b[orderBy]
    : parseFloat(b[orderBy]);

  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function SortableTable({
  // order = "desc",
  // orderBy = "totalLiquidityUSD",
  columns,
  rows,
  title,
  ...props
}) {
  const classes = useStyles();

  const [order, setOrder] = React.useState(props.order || "desc");
  const [orderBy, setOrderBy] = React.useState(props.orderBy);
  const [filter, setFilter] = React.useState()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRequestFilter = (type) => {
    setFilter(type);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const filteredRows = filter ? rows.filter(rows => rows.__typename === filter) : rows;
  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));

  return (
    <div className={classes.root}>
      {title && (
        <Typography variant="h6" component="h2" className={classes.title}>
          {title}
        </Typography>
      )}
      <TableContainer>
        <Table className={classes.table} aria-label={`${title} table`}>
          <SortableTableHead
            columns={columns}
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onRequestFilter={handleRequestFilter}
            rowCount={sortedRows.length}
            cellProps={{ className: classes.cell }}
          />
          <TableBody>
            {sortedRows
              // .filter((row) => {
              //   return !TOKEN_DENY.includes(row.id);
              // })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow key={row.id}>
                    {columns.map((column, i) => {
                      return (
                        <TableCell
                          key={i}
                          {...(i === 0
                            ? { component: "th", scope: "row" }
                            : {})}
                          align={column.align || "left"}
                          className={classes.cell}
                          // variant="body"
                        >
                          {typeof column.render === "function"
                            ? column.render(row, index)
                            : row[column.key]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, , { label: "All", value: -1 }]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

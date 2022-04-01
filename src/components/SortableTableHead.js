import {
  Button,
  Hidden,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core";

import React from "react";

export default function SortableTableHead({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  onRequestFilter,
  columns,
  cellProps,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.key}
            align={column.align || "left"}
            padding={column.disablePadding ? "none" : "default"}
            // variant="head"
            sortDirection={orderBy === column.key ? order : false}
            {...cellProps}
          >
            {column.key === "__typename" ? (
              <>
                <Button variant="text" onClick={() => onRequestFilter()}>All</Button>
                <Button variant="text" onClick={() => onRequestFilter("Swap")}>Swaps</Button>
                <Button variant="text" onClick={() => onRequestFilter("Mint")}>Adds</Button>
                <Button variant="text" onClick={() => onRequestFilter("Burn")}>Removes</Button>
              </>
            ) : (
              <TableSortLabel
                active={orderBy === column.key}
                direction={orderBy === column.key ? order : "asc"}
                onClick={createSortHandler(column.key)}
              >
                {column.label}

                {orderBy === column.key ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

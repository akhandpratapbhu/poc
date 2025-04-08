import { useState, ChangeEvent, MouseEvent } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

import {
    Box,
    Paper,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Checkbox,
    Menu,
    MenuItem,
    Popover,
    InputAdornment,
    FormControlLabel,
    TableSortLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    DialogActions,
} from "@mui/material";
import { Search, KeyboardArrowDown, FilterList, TableRows, FileDownload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Excel library
import jsPDF from "jspdf"; // PDF library
export interface JobData {
    SaleId: string;
    InvoiceNo: string;
    InvoiceDate: string;
    PFInvoiceNo: string;
    CustomerType: string;
    SaleTo: string;
    NoOfItems: number;
    paymentType: string;
    Amount: number;
    Remarks: string;
    Status: string;
    CancelRemark: string;
    Action: string;
}


interface Column {
    id: keyof JobData;
    label: string;
    visible: boolean;
}

const mockData: JobData[] = [
    {
        SaleId: "S00012345",
        InvoiceNo: "INV-2025-001",
        InvoiceDate: "13-02-2025",
        PFInvoiceNo: "PF-2025-001",
        CustomerType: "Retail",
        SaleTo: "Jatin Bansal",
        NoOfItems: 3,
        paymentType: "Cash",
        Amount: 12500,
        Remarks: "Paid in full",
        Status: "Completed",
        CancelRemark: "",
        Action: "..."
    },
    {
        SaleId: "S00012346",
        InvoiceNo: "INV-2025-002",
        InvoiceDate: "12-02-2025",
        PFInvoiceNo: "PF-2025-002",
        CustomerType: "Corporate",
        SaleTo: "Anurag Tiwari",
        NoOfItems: 2,
        paymentType: "Credit",
        Amount: 9800,
        Remarks: "Pending approval",
        Status: "Pending",
        CancelRemark: "",
        Action: "..."
    },
    {
        SaleId: "S00012347",
        InvoiceNo: "INV-2025-003",
        InvoiceDate: "11-02-2025",
        PFInvoiceNo: "PF-2025-003",
        CustomerType: "Retail",
        SaleTo: "Rohit Kumar",
        NoOfItems: 5,
        paymentType: "Card",
        Amount: 16200,
        Remarks: "Discount applied",
        Status: "Completed",
        CancelRemark: "",
        Action: "..."
    }
];


const initialColumns: Column[] = [
    { id: "SaleId", label: "Sale Id", visible: true },
    { id: "InvoiceNo", label: "Invoice No", visible: true },
    { id: "InvoiceDate", label: "Invoice Date", visible: true },
    { id: "PFInvoiceNo", label: "PF Invoice No", visible: true },
    { id: "CustomerType", label: "Customer Type", visible: true },
    { id: "SaleTo", label: "Sale To", visible: true },
    { id: "NoOfItems", label: "No Of Items", visible: true },
    { id: "paymentType", label: "Payment Type", visible: true },
    { id: "Amount", label: "Amount", visible: true },
    { id: "Remarks", label: "Remarks", visible: true },
    { id: "Status", label: "Status", visible: true },
    { id: "CancelRemark", label: "CancelRemark", visible: true },
    { id: "Action", label: "Action", visible: true },

];

const SparePartSaleInvoiceTable: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [selected, setSelected] = useState<string[]>([]);
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<string>("");

    // Menu states
    const [manageColumnsAnchor, setManageColumnsAnchor] = useState<HTMLButtonElement | null>(null);
    const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
    const [searchTermsColumnWise, setSearchTermsColumnWise] = useState<Record<keyof JobData, string>>({
        SaleId: "",
        InvoiceNo: "",
        InvoiceDate: "",
        PFInvoiceNo: "",
        CustomerType: "",
        SaleTo: "",
        NoOfItems: "",
        paymentType: "",
        Amount: "",
        Remarks: "",
        Status: "",
        CancelRemark: "",
        Action: "",
    });



    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = mockData.map((n) => n.SaleId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // const filteredData = mockData.filter((item) =>
    //   Object.values(item).some((value) =>
    //     String(value).toLowerCase().includes(searchTerm)
    //   )
    // );

    const handleClick = (event: MouseEvent<HTMLTableRowElement>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((selectedId) => selectedId !== id);
        }

        setSelected(newSelected);
    };

    const handleColumnVisibilityChange = (columnId: keyof JobData) => {
        setColumns(
            columns.map((col) =>
                col.id === columnId ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const isSelected = (id: string) => selected.includes(id);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchColumnWise = (id: keyof JobData, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTermsColumnWise((prev) => ({
            ...prev,
            [id]: e.target.value.toLowerCase(),
        }));
    };


    const filteredData = mockData.filter((item) => {
        // Global Search Logic
        const isGlobalMatch = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm)
        );

        // Column-Wise Search Logic
        const isColumnMatch = Object.entries(searchTermsColumnWise).every(([key, term]) => {
            if (!term) return true; // Skip filtering for empty search fields
            return String(item[key as keyof JobData]).toLowerCase().includes(term);
        });

        return isGlobalMatch && isColumnMatch; // Both filters should match
    });

    const handleRequestSort = (columnId: string) => {
        const isAsc = orderBy === columnId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(columnId);
    };

    const sortedData = [...filteredData].sort((a, b) => {
        if (orderBy) {
            const key = orderBy as keyof JobData; // ✅ Explicitly tell TypeScript it's a valid key

            if (a[key] < b[key]) return order === "asc" ? -1 : 1;
            if (a[key] > b[key]) return order === "asc" ? 1 : -1;
        }
        return 0;
    });
    const [open, setOpen] = useState(false);

    // Function to export data as Excel
    const exportAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData); // Convert JSON to worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "export.xlsx");
        setOpen(false); // Close dialog
    };

    // Function to export data as PDF
    const exportAsPDF = () => {
        const doc = new jsPDF();
        doc.text("Exported Data", 10, 10);

        let y = 20;
        filteredData.forEach((item, index) => {
            doc.text(`${index + 1}. ${JSON.stringify(item)}`, 10, y);
            y += 10;
        });

        doc.save("export.pdf");
        setOpen(false); // Close dialog
    };
    const [selectedRow, setSelectedRow] = useState<JobData | null>(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);

const handleActionClick = (row: JobData) => {
    setSelectedRow(row);
    setIsPopupOpen(true);
};

const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedRow(null);
};
const handleAction = (type: "view" | "edit" | "print" | "cancel") => {
    if (!selectedRow) return;

    switch (type) {
        case "view":
            console.log("View clicked:", selectedRow);
            break;
        case "edit":
            console.log("Edit clicked:", selectedRow);
            break;
        case "print":
            console.log("Print clicked:", selectedRow);
            break;
        case "cancel":
            console.log("Cancel clicked:", selectedRow);
            break;
    }
};

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '30px' }}>
                <span style={{ font: "40px", padding: '5px', margin: '10px' }}>Spare-spare part sale Invoice</span>
                <button
                    onClick={() => navigate("/create-spare-sale-invoice")}
                    style={{ color: "white", backgroundColor: "red", borderRadius: '10px', width: "100px", height: "40px", padding: '5px' }}
                >
                    + Add New
                </button>
            </div>
            <div className="card" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f5f5", // light gray card background
                padding: "6px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",

            }}>
                <Box sx={{ width: "100%", p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {/* <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
            Spare-spare part sale Invoice
            </Typography> */}
                            <TextField
                                size="small"
                                placeholder="Search"
                                sx={{
                                    bgcolor: "grey.50",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "grey.300",
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleSearch}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<KeyboardArrowDown />}
                                startIcon={<TableRows />}
                                sx={{
                                    bgcolor: "grey.50",
                                    textTransform: "none",
                                    color: "text.primary",
                                }}
                                onClick={(e) => setManageColumnsAnchor(e.currentTarget)}
                            >
                                Manage Columns
                            </Button>

                            <Menu
                                anchorEl={manageColumnsAnchor}
                                open={Boolean(manageColumnsAnchor)}
                                onClose={() => setManageColumnsAnchor(null)}
                                PaperProps={{
                                    sx: { maxHeight: 300, width: 200 },
                                }}
                            >
                                {columns.map((column) => (
                                    <MenuItem key={column.id} dense>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={column.visible}
                                                    onChange={() => handleColumnVisibilityChange(column.id)}
                                                    size="small"
                                                />
                                            }
                                            label={column.label}
                                        />
                                    </MenuItem>
                                ))}
                            </Menu>

                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<KeyboardArrowDown />}
                                sx={{
                                    bgcolor: "grey.50",
                                    textTransform: "none",
                                    color: "text.primary",
                                }}
                            >
                                Default View
                            </Button>

                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<KeyboardArrowDown />}
                                startIcon={<FilterList />}
                                sx={{
                                    bgcolor: "grey.50",
                                    textTransform: "none",
                                    color: "text.primary",
                                }}
                                onClick={(e) => setFilterAnchor(e.currentTarget)}
                            >
                                Filter
                            </Button>

                            <Popover
                                open={Boolean(filterAnchor)}
                                anchorEl={filterAnchor}
                                onClose={() => setFilterAnchor(null)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                PaperProps={{
                                    sx: { p: 2, width: 650 },
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    filter Columns-wise
                                </Typography>
                                {columns.map((column) => (
                                    <MenuItem key={column.id} dense>
                                        <TextField
                                            placeholder={`Search ${column.label}`}
                                            variant="outlined"
                                            size="small"
                                            value={searchTermsColumnWise[column.id]} // Bind input value
                                            onChange={(e) => handleSearchColumnWise(column.id, e)} // Handle change
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />
                                    </MenuItem>
                                ))}

                            </Popover>

                            {/* Export Button */}
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<KeyboardArrowDown />}
                                startIcon={<FileDownload />}
                                sx={{ bgcolor: "grey.50", textTransform: "none", color: "text.primary" }}
                                onClick={() => setOpen(true)}
                            >
                                Export
                            </Button>

                            {/* Dialog Popup */}
                            <Dialog open={open} onClose={() => setOpen(false)}>
                                <DialogTitle>Select Export Format</DialogTitle>
                                <DialogContent>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={exportAsPDF}>
                                                <ListItemText primary="Export as PDF" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={exportAsExcel}>
                                                <ListItemText primary="Export as Excel" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 180px)" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={{ bgcolor: "grey.50" }}>
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < sortedData.length}
                                            checked={sortedData.length > 0 && selected.length === sortedData.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    {columns.filter((col) => col.visible).map((column) => (
                                        <TableCell
                                            key={column.id}
                                            sx={{ bgcolor: "grey.50", fontWeight: 500, color: "text.secondary" }}
                                            sortDirection={orderBy === column.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : "asc"}
                                                onClick={() => handleRequestSort(column.id)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    const isItemSelected = isSelected(row.SaleId);

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.SaleId)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.SaleId}
                                            selected={isItemSelected}
                                            sx={{
                                                bgcolor: index % 2 === 0 ? "white" : "grey.50",
                                                "&:hover": { bgcolor: "action.hover" },
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isItemSelected} />
                                            </TableCell>
                                            {columns.filter((col) => col.visible).map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                >
                                                    {column.id === "Action" ? (
                                                        <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // prevent row click conflict
                                                            handleActionClick(row);
                                                        }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    
                                                    ) : (
                                                        row[column.id]
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>;
                    <Dialog open={isPopupOpen} onClose={handleClosePopup} fullWidth maxWidth="sm">
    <DialogTitle>Actions</DialogTitle>
    <DialogContent dividers>
        {selectedRow && (
            <>
                 <Typography gutterBottom><strong>Sale ID:</strong> {selectedRow.SaleId}</Typography>
                <Typography gutterBottom><strong>SaleTo:</strong> {selectedRow.SaleTo}</Typography>
                <Typography gutterBottom><strong>InvoiceNo:</strong> {selectedRow.InvoiceNo}</Typography> 

                <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                    <Button variant="contained" onClick={() => handleAction("view")}>View</Button>
                    <Button variant="contained" color="primary" onClick={() => handleAction("edit")}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleAction("print")}>Print</Button>
                    <Button variant="outlined" color="error" onClick={() => handleAction("cancel")}>Cancel</Button>
                </Box>
            </>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClosePopup}>Close</Button>
    </DialogActions>
</Dialog>

                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </div>
        </>
    );
};

export default SparePartSaleInvoiceTable;

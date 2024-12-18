import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { db } from "../../firebase";
import { collection, getDocs} from "firebase/firestore";
import { Route, useNavigate} from "react-router-dom";
import "./CustomerManager.css"
function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCustomers = async () => {
        setLoading(true);
        const customerCollection = collection(db, "KhachHang");
        const customerSnapshot = await getDocs(customerCollection);
        const customerList = customerSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          stt: index + 1,
        }));
        setLoading(false);
        setCustomers(customerList);
      };
      
      fetchCustomers();
    }, []);
    
    const columns = [
      {
        name: "Tên khách hàng",
        selector: (row) => row.tenKhachHang,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
      },
      {
          name: "Số điện thoại",
          selector: (row) => row.soDienThoai,
        },
        {
          name: "Đơn hàng",
          cell: (row) => (
            <div>
              <button onClick={() => navigate(`/customer/${row.id}`)}>Xem chi tiết</button>
            </div>
          ),
        },
    ];
    return (
      <div class="customer-container">
      <h2>Quản lý Khách hàng</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <DataTable
          title="Danh sách khách hàng"
          columns={columns}
          data={customers.filter((customer) => customer && !customer.isAdmin)} 
          pagination
          highlightOnHover
          paginationComponentOptions={{
            noRowsPerPage: true, 
          }}
          customStyles={{
            pagination:{
              style:{
                marginTop: "10px",
                display: "block",
                textAlign:"center"
              }
            }
          }}
        />
      )}
    </div>
    );
  }
  
  export default CustomerList;
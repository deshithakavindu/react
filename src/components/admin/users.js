import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Popconfirm, message, Modal, Form, Input, Select } from "antd";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  // Fetch user data on component mount
  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:5000/getAllUser")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setUsers(data.data); // Populate user data into state
        } else {
          console.error("Error fetching user data:", data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    fetch("http://localhost:5000/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }), // Send the user ID in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          message.success("User deleted successfully");
          fetchUsers(); // Refresh the user list
        } else {
          message.error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        message.error("Failed to delete user");
      });
  };

  const showUpdateModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true); // Show the update modal with selected user data
  };

  const handleUpdateUser = (values) => {
    // Add the user ID from the selectedUser
    fetch("http://localhost:5000/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser._id,  // Add this line
        fname: values.fname,
        lname: values.lname,
        email: values.email,
        userType: values.userType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          message.success("User updated successfully");
          fetchUsers(); // Refresh the user list
          setIsModalVisible(false); // Close the modal
        } else {
          message.error("Failed to update user: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        message.error("Failed to update user");
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  // Handle Search Input Change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update the search term state
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(
    (user) =>
      user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "First Name",
      dataIndex: "fname",
      key: "fname",
    },
    {
      title: "Last Name",
      dataIndex: "lname",
      key: "lname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => showUpdateModal(record)} // Show the update modal for the selected user
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record._id)} // Pass the user's ID to delete
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>

      {/* Search Bar */}
      <Input
        placeholder="Search users by name, email, or type"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={filteredUsers} // Use the filtered users for display
          columns={columns}
          rowKey="_id" // Unique key for rows, use MongoDB ObjectID
          bordered
        />
      )}

      {/* Modal for updating user */}
      <Modal
        title="Update User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={{
            fname: selectedUser?.fname,
            lname: selectedUser?.lname,
            email: selectedUser?.email,
            userType: selectedUser?.userType,
          }}
          onFinish={handleUpdateUser}
        >
          <Form.Item label="First Name" name="fname" rules={[{ required: true, message: "Please input the first name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lname" rules={[{ required: true, message: "Please input the last name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input the email!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="User Type" name="userType" rules={[{ required: true, message: "Please select the user type!" }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;

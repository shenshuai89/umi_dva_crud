import React, { useState, useRef, FC, ReactNode } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  Pagination,
  message,
} from "antd";

import { connect, Dispatch, Loading, UserState, request } from "umi";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { addRecord, editRecord } from "./service";
import UserModal from "./components/UserModal";
import { SingleUserType, FormValues } from "./data.d";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  usersListLoading: boolean;
}
const UsersListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  usersListLoading,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [record, setRecord] = useState<SingleUserType | null>(null);
  let confirm = (record: SingleUserType) => {
    let id = record.id;
    console.log(id);
    dispatch({
      type: "users/delete",
      payload: id,
    });
  };
  const columns: ProColumns<SingleUserType>[] = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      valueType: "text",
    },
    {
      title: "标题",
      dataIndex: "name",
      key: "name",
      valueType: "text",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      valueType: "dateTime",
    },
    {
      title: "编辑",
      key: "tags",
      dataIndex: "tags",
      valueType: "text",
      render: (text: ReactNode | undefined, record: SingleUserType) => (
        <Space size="middle">
          <a
            onClick={() => {
              editModal(record);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={() => {
              confirm(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const editModal = (record: SingleUserType) => {
    setRecord(record);
    setModalVisible(true);
  };
  const cancelModal = () => {
    setRecord(null);
    setModalVisible(false);
  };
  const onFinish = async (values: FormValues) => {
    // console.log(values, record);
    let id = 0;
    if (record) {
      id = record.id;
    }
    setConfirmLoading(true);
    let serviceReqest;
    if (id) {
      serviceReqest = editRecord;
    } else {
      serviceReqest = addRecord;
    }
    const result = await serviceReqest({ id, values });
    if (result) {
      cancelModal();
      message.success(`${id ? "编辑" : "添加"} 成功!`);
      dispatch({
        type: "users/getRemote",
        payload: {
          page: users.meta.page,
          per_page: users.meta.per_page,
        },
      });
      setConfirmLoading(false);
    } else {
      message.error(`${id ? "编辑" : "添加"} 失败!`);
      setConfirmLoading(false);
    }
    // 有id时,为修改记录
    // if (id) {
    //   if (result) {
    //     cancelModal();
    //     message.success("edit success!");
    //     dispatch({
    //       type: "users/getRemote",
    //       payload: {
    //         page: users.meta.page,
    //         per_page: users.meta.per_page,
    //       },
    //     });
    //   } else {
    //     message.error("edit failed!");
    //   }

    //   // dispatch({
    //   //   type: "users/edit",
    //   //   payload: { values, id },
    //   // });
    // } else {
    //   // 没有ID新增一条记录
    //   const result = await addRecord({ values });
    //   if (result) {
    //     cancelModal();
    //     message.success("add success!");
    //     dispatch({
    //       type: "users/getRemote",
    //       payload: {
    //         page: users.meta.page,
    //         per_page: users.meta.per_page,
    //       },
    //     });
    //   } else {
    //     message.error("add failed!");
    //   }
    //   // dispatch({
    //   //   type: "users/addRecord",
    //   //   payload: { values },
    //   // });
    // }
  };
  const addHandle = () => {
    setModalVisible(true);
    // dispatch({
    //   type: "users/addRecord",
    // });
  };
  const reloadHandle = () => {
    // ref.current.reload();
    dispatch({
      type: "users/getRemote",
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page,
      },
    });
  };
  // const requestHandle = async ({
  //   pageSize,
  //   current,
  // }: {
  //   pageSize: number;
  //   current: number;
  // }) => {
  //   const users = await editRecord({
  //     page: current,
  //     per_page: pageSize,
  //   });
  //   return {
  //     data: users.data,
  //     success: true,
  //     total: users.meta.total,
  //   };
  // };
  const paginationHandle = (page: number, pageSize?: number) => {
    // console.log(page, pageSize);
    dispatch({
      type: "users/getRemote",
      payload: {
        page,
        per_page: pageSize,
      },
    });
  };
  return (
    <div className="list-table">
      <ProTable
        columns={columns}
        rowKey="id"
        dataSource={users.data}
        loading={usersListLoading}
        // request={requestHandle}
        search={false}
        pagination={false}
        headerTitle="使用UMI和DVA创建的CRUD表格"
        toolBarRender={() => [
          <Button onClick={addHandle} type="primary">
            新增
          </Button>,
          <Button onClick={reloadHandle}>刷新</Button>,
        ]}
        options={{
          density: true,
          fullScreen: true,
          reload: reloadHandle,
          setting: true,
        }}
      />
      <Pagination
        total={users.meta.total}
        showSizeChanger
        showQuickJumper
        current={users.meta.page}
        pageSize={users.meta.per_page}
        onChange={paginationHandle}
        showTotal={(total) => `Total ${total} items`}
        className="pagination_right"
      />
      <UserModal
        modalVisible={modalVisible}
        handleCancel={cancelModal}
        record={record}
        onFinish={onFinish}
        confirmLoading={confirmLoading}
      ></UserModal>
    </div>
  );
};

const mapStateToProps = ({
  users,
  loading,
}: {
  users: UserState;
  loading: Loading;
}) => {
  console.log("modal connect users data", users);
  return {
    users,
    usersListLoading: loading.models.users,
  };
};
export default connect(mapStateToProps)(UsersListPage);

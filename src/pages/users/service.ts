// import { request } from 'umi';
import request, { extend } from 'umi-request';
import { message } from 'antd';
import { FormValues } from './data.d';

interface codeMapValues {
  [name: string]: any;
}

const errorHandler = function(error: any) {
  const codeMap: codeMapValues = {
    PUT: '修改记录出错',
    DELETE: '删除记录出错',
    POST: '新增记录出错',
    GET: '获取数据出错',
  };
  if (error.response) {
    console.log(error.response.status);
    console.log(error.data);
    console.log(error.request.options.method);
    if (error.response.status > 400) {
      message.error(
        error.data.message
          ? codeMap[error.request.options.method] + error.data.message
          : codeMap[error.request.options.method] + error.data,
      );
    } else {
      message.success(error.data);
    }
  } else {
    message.error('网络错误');
  }
  throw error;
};
const extendRequest = extend({ errorHandler });

const getUsersList = async ({
  page,
  per_page,
}: {
  page: number;
  per_page: number;
}) => {
  return extendRequest(
    `http://public-api-v1.aspirantzhang.com/users?page=${page}&per_page=${per_page}`,
    {
      method: 'get',
    },
  )
    .then(response => {
      // console.log(response);
      return response;
    })
    .catch(error => {
      return false;
    });
  const list = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return list;
};
const editRecord = async ({
  id,
  values,
}: {
  id: number;
  values: FormValues;
}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'put',
    data: values,
  })
    .then(response => {
      return true;
    })
    .catch(error => {
      return false;
    });
};
const addRecord = async ({ values }: { values: FormValues }) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users`, {
    method: 'post',
    data: values,
  })
    .then(response => {
      return true;
    })
    .catch(error => {
      return false;
    });
};
const deleteRecord = async ({ id }: { id: number }) => {
  console.log(id);
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'delete',
  })
    .then(response => {
      return true;
    })
    .catch(error => {
      return false;
    });
};
export { getUsersList, editRecord, addRecord, deleteRecord };

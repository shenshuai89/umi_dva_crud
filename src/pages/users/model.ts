import { Reducer, Effect, Subscription } from 'umi';
import { getUsersList, editRecord, deleteRecord, addRecord } from './service';
import { message } from 'antd';
import { SingleUserType } from './data.d';

export interface UserState {
  data: SingleUserType[];
  meta: {
    total: number;
    per_page: number;
    page: 1;
  };
}

interface IModel {
  namespace: 'users';
  state: UserState;
  reducers: {
    getUserList: Reducer<UserState>;
  };
  effects: {
    getRemote: Effect;
    edit: Effect;
    addRecord: Effect;
    delete: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}
const modelData: IModel = {
  namespace: 'users',
  state: {
    data: [],
    meta: {
      total: 0,
      per_page: 5,
      page: 1,
    },
  },
  reducers: {
    getUserList(state, { payload }) {
      // console.log('getUserList', payload);
      return payload;
    },
  },
  effects: {
    *getRemote({ payload: { page, per_page } }, { put, call }) {
      const userList = yield call(getUsersList, { page, per_page });
      // console.log('getRemote', userList);
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
      if (userList) {
        message.success('加载数据成功');
        yield put({ type: 'getUserList', payload: { ...userList } });
      } else {
        message.error('加载数据失败');
      }
    },
    *edit({ payload }, { put, call, select }) {
      let { id, values } = payload;
      const data = yield call(editRecord, { id, values });
      if (data) {
        message.success('编辑成功');
        let { page, per_page } = yield select(
          (state: { users: { meta: any } }) => state.users.meta,
        );
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      } else {
        message.error('编辑失败');
      }
    },
    *delete({ payload }, { put, call, select }) {
      const data = yield call(deleteRecord, { id: payload });
      if (data) {
        message.success('删除成功');
        let { page, per_page } = yield select(
          (state: { users: { meta: any } }) => state.users.meta,
        );
        console.log(page, per_page);
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      } else {
        message.error('删除失败');
      }
    },
    *addRecord({ payload }, { put, call, select }) {
      let { values } = payload;
      const data = yield call(addRecord, { values });
      if (data) {
        message.success('添加成功');
        let { page, per_page } = yield select(
          (state: { users: { meta: any } }) => state.users.meta,
        );
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      } else {
        message.error('添加失败');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
            payload: {
              page: 1,
              per_page: 10,
            },
          });
        }
      });
    },
  },
};

export default modelData;

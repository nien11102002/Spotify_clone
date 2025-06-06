import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { apiLogin } from "../apis/apiLogin";
import { useAppDispatch } from "../redux/hooks";
import { userAction } from "../redux/slice/user.slice";
import { useModal } from "../globalContext/ModalContext";
import { useNavigate } from "react-router-dom";
interface Props {
  propsHiddenModal: () => void;
}
const FormLogin: React.FC<Props> = ({ propsHiddenModal }) => {
  const navigate = useNavigate();

  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const onFinish = async (values: any) => {
    try {
      const result = await apiLogin(values);
      console.log(values);

      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        dispatch(userAction.setUser(result));
        success();
        propsHiddenModal();
        navigate("");
      }
    } catch {
      error();
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Login Success",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Account Or Password Is Incorrect",
    });
  };

  const handleSwitchRegister = () => {
    openModal("register");
  };
  return (
    <>
      {contextHolder}
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="identifier"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or <a onClick={handleSwitchRegister}>Register now!</a>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormLogin;

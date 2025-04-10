import { Modal } from "antd";
import { useModal } from "../../../globalContext/ModalContext";
import FormLogin from "../../../components/login";
import FormRegister from "../../../components/register";

export default function ModalContainer() {
  const { modalType, closeModal } = useModal();

  return (
    <Modal
      open={modalType !== null}
      title={modalType === "login" ? "Login" : "Register"}
      onCancel={closeModal}
      footer={null}
    >
      {modalType === "login" && <FormLogin propsHiddenModal={closeModal} />}
      {modalType === "register" && (
        <FormRegister propsHiddenModal={closeModal} />
      )}
    </Modal>
  );
}

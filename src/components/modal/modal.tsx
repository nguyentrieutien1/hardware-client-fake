import { ReactElement } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
interface AppModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  onConfirm: () => void;
  title: string;
  content: ReactElement | string;
  size?: "sm" | "lg" | "xl";
}
export function AppModal(props: AppModalProps) {
  const { modalIsOpen, closeModal, title, content, onConfirm, size } = props;
  return (
    <>
      {size ? (
        <Modal
          size={size}
          backdrop="static"
          show={modalIsOpen}
          onHide={() => closeModal()}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button className="p-2"  variant="secondary" onClick={() => closeModal()}>
              Đóng
            </Button>
            <Button className="p-2"  variant="success" onClick={() => onConfirm()}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal  backdrop="static" show={modalIsOpen} onHide={() => closeModal()}>
          <Modal.Header closeButton={false}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button className="p-2"  size="sm" variant="secondary" onClick={() => closeModal()}>
              Đóng
            </Button>
            <Button className="p-2" size="sm" variant="success" onClick={() => onConfirm()}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

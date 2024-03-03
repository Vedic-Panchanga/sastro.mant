import { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Anchor } from "@mantine/core";
type ModalButtonProps = {
  children: ReactNode;
  text: ReactNode;
  modalHeading?: string;
  size?: "sm" | "md" | "lg" | "xl";
};
export default function ModalText({
  children,
  text,
  modalHeading,
  size = "xl",
}: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Anchor component="button" onClick={open} variant="transparent">
        {text}
      </Anchor>
      <Modal
        opened={opened}
        onClose={close}
        title={modalHeading}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 4,
        }}
        size={size}
      >
        {children}
      </Modal>
    </>
  );
}

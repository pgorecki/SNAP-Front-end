import { toast } from 'react-toastify';

const toaster = {
  success(message) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  },
  error(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  },
};

export default toaster;

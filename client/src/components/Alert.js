import { useAppConsumer } from '../context/appContext';

const Alert = () => {
  const { alertText, alertType } = useAppConsumer();
  console.log(alertText, alertType);
  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
};

export default Alert;

import React from 'react';

export default function useNotification({autoClean,duration}:{autoClean?:boolean,duration?:number}){
  type NotificationType= "error" | "info" | "success" | "warning"
  const OPEN_PERIOD= duration ||6000
  const [notification, setNotification] = React.useState<{type:NotificationType,content:string}>({
    content: '',
    type: 'info',
  });

  const clearNotification = () => {
    setTimeout(() => {
      setNotification({ ...notification, content: '' });
    }, OPEN_PERIOD);
  };
  React.useEffect(() => {
    if(autoClean && notification.content) {
      clearNotification()
    }
  }, [notification,autoClean])

  const notify =({type,content}:{type:NotificationType,content:string})=>{
    setNotification({ type, content});
  }
return { notification,notify,clearNotification}
}
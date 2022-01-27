import { useEffect, useState } from "react";

export function AsyncComponent() {
  // to show
  // const [isButtonVisible, setIsButtonVisible] = useState(false);

  // to unshow
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // setIsButtonVisible(true);
      setIsButtonInvisible(true);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>olá</h1>
      {/* to show */}
      {/* {isButtonVisible && <button>Button is now visible</button>} */}

      {/* to unshow */}
      {!isButtonInvisible && <button>Button has invisible function</button>}
    </div>
  );
}

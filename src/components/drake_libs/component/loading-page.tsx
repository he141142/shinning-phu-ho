import { useEffect } from "react";


// Animated Loading Component
const LoadingPage: React.FC = () => {
    useSpinnerStyles();
  
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  };
  

  // Animated Error Page
const ErrorPage: React.FC<{ message: string }> = ({ message }) => {
    return (
      <div style={styles.container}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.text}>Error: {message}</p>
      </div>
    );
  };

  // Add the spinner animation CSS
const useSpinnerStyles = () => {
    useEffect(() => {
      if (typeof window !== "undefined") {
        const spinnerAnimation = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
  
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = spinnerAnimation;
        document.head.appendChild(styleSheet);
  
        // Cleanup on unmount
        return () => {
          document.head.removeChild(styleSheet);
        };
      }
    }, []);
  };
  
  

  // Styles for loading and error pages
const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    text: {
      marginTop: "20px",
      fontSize: "18px",
      color: "#555",
    },
    errorIcon: {
      fontSize: "40px",
      marginBottom: "10px",
    },
  };
  


  export { LoadingPage, ErrorPage };
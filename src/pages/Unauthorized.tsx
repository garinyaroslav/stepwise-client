import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const Unauthorized = () => {
    const navigate = useNavigate();

    const onClickLogin = () => {
        localStorage.removeItem("auth-storage");
        navigate("/login");
    };

    const onClickOnDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="shadcn-card bg-white rounded-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg
                            className="h-10 w-10 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        401 Не авторизован
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Для доступа к этой странице требуется авторизация
                    </p>

                    <Button onClick={onClickLogin}>Войти в систему</Button>

                    <div className="mt-4">
                        <a
                            onClick={onClickOnDashboard}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Вернуться на главную
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const downloadExcelFileWithXLSX = async (username: string, email: string, password: string) => {
    try {
        const XLSX = await import('xlsx');

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([
            ["Username", "Email", "Password"],
            [username, email, password]
        ]);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Admin Credentials");

        XLSX.writeFile(workbook, `данные_для_входа_${username}.xlsx`);
    } catch (error) {
        console.error("Error generating Excel file:", error);
    }
};

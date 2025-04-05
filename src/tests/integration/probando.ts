//// describe("Test", () => {
////   // ==> beforeAll se puso en caso de encontrar error por las console.log de = connectDB()
////   beforeAll(async () => {
////     await connectDB();
////   });

////   // Debería devolver un código de estado 200 desde la URL de la página de inicio
////   it("Should return a 200 status code from the homepage url", async () => {
////     const response = await request(server).get("/");

////     expect(response.statusCode).toBe(200);
////     expect(response.text).toBe("Todo bien");
////   });
//// });

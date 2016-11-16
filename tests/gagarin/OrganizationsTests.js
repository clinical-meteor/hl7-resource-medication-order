describe('clinical:hl7-resources-medication-orders', function () {
  var server = meteor();
  var client = browser(server);

  it('MedicationOrders should exist on the client', function () {
    return client.execute(function () {
      expect(MedicationOrders).to.exist;
    });
  });

  it('MedicationOrders should exist on the server', function () {
    return server.execute(function () {
      expect(MedicationOrders).to.exist;
    });
  });

});

<div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="paymentModalLabel">Payment Confirmation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Please transfer the total amount to the following bank account:</p>
                <div class="mb-3 p-3 border rounded">
                    <strong>Bank Name:</strong> Bank Central Asia (BCA)<br>
                    <strong>Account Number:</strong> 1234 5678 90<br>
                    <strong>Account Name:</strong> IFYNTH Store Owner<br>
                    <strong>Total Amount:</strong> <span id="modalTotalAmount" class="fw-bold text-danger"></span><br>
                    <strong>Payment Method:</strong> <span id="modalPaymentMethod" class="fw-bold"></span>
                </div>

                <form id="paymentProofForm" enctype="multipart/form-data">
                    <input type="hidden" id="modalTransactionId" name="transaction_id">
                    <div class="mb-3">
                        <label for="paymentProof" class="form-label">Upload Payment Proof</label>
                        <input class="form-control" type="file" id="paymentProof" name="payment_proof"
                            accept="image/*" required>
                        <div class="form-text">Max file size 2MB. Only images (JPG, PNG).</div>
                    </div>
                    <div class="text-center">
                        <img id="imagePreview" src="#" alt="Image Preview" class="img-thumbnail"
                            style="display: none; max-width: 200px; max-height: 200px;">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" form="paymentProofForm" class="btn btn-primary"
                    id="submitPaymentProofBtn">Confirm Payment</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="shippingAddressModal" tabindex="-1" aria-labelledby="shippingAddressModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="shippingAddressModalLabel">Shipping Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <h6>Shipping Address</h6>
                        <div class="p-3 border rounded">
                            <strong>Recipient:</strong> <span id="modalRecipientName"></span><br>
                            <strong>Phone:</strong> <span id="modalPhoneNumber"></span><br>
                            <strong>Address:</strong> <span id="modalAddress"></span>, <span
                                id="modalZipCode"></span><br>
                            <strong>Destination:</strong> <span id="modalDestinationLabel"></span><br>
                            <strong>Courier:</strong> <span id="modalCourier"></span><br>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Order Status Progress</h6>
                        {{-- Container untuk progress bar dinamis --}}
                        <div id="orderProgressBar" class="order-tracking-section px-4 py-3">
                            <div class="progress-bar-container">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
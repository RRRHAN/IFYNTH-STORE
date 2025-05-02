<div class="tab-pane fade" id="my-order" role="tabpanel">
    <h5 class="mb-4">Recent My Orders</h5>

    <div style="overflow-x: auto;">
        <table class="table">
            <thead>
                <tr class="text-center align-middle">
                    <th scope="col">No</th>
                    <th scope="col">Transaction ID</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @if (!empty($transactions) && count($transactions) > 0)
                    @foreach ($transactions as $transaction)
                        <tr class="text-center align-middle">
                            <th scope="row">{{ $loop->iteration }}</th>
                            <td>{{ $transaction['ID'] }}</td>
                            <td>{{ $transaction['PaymentMethod'] ?? '-' }}</td>
                            <td>Rp.{{ number_format($transaction['TotalAmount'] ?? 0) }}</td>
                            <td>{{ ucfirst($transaction['Status'] ?? '-') }}</td>
                            <td>
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal"
                                    data-bs-target="#detailModal{{ $loop->iteration }}"
                                    data-transaction="{{ json_encode($transaction) }}"
                                    onclick="loadTransactionData(this)">
                                    Detail
                                </button>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="6" class="text-center">No orders available.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

@foreach ($transactions as $transaction)
    <div class="modal fade" id="detailModal{{ $loop->iteration }}" tabindex="-1" aria-labelledby="detailModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="detailModalLabel">Transaction Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Transaction Info -->
                    <h6>Transaction Info</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Transaction ID:</strong> <span id="transactionID{{ $loop->iteration }}"></span>
                            </p>
                            <p><strong>Payment Method:</strong> <span id="paymentMethod{{ $loop->iteration }}"></span>
                            </p>
                            <p><strong>Total Amount:</strong> Rp. <span id="totalAmount{{ $loop->iteration }}"></span>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Status:</strong> <span id="status{{ $loop->iteration }}"></span></p>
                        </div>
                    </div>
                    <hr>
                    <!-- Products Info -->
                    <h6>Products:</h6>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Total Price</th>
                                <th>Size</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody id="productDetails{{ $loop->iteration }}"></tbody>
                    </table>
                    <hr>
                    <!-- Shipping Address Info -->
                    <h6>Shipping Address:</h6>
                    <p><strong>Name:</strong> <span id="shippingName{{ $loop->iteration }}"></span></p>
                    <p><strong>Phone:</strong> <span id="shippingPhone{{ $loop->iteration }}"></span></p>
                    <p><strong>Address:</strong> <span id="shippingAddress{{ $loop->iteration }}"></span></p>
                    <p><strong>Destination:</strong> <span id="shippingDestination{{ $loop->iteration }}"></span></p>
                    <p><strong>Courir:</strong> <span id="shippingCourir{{ $loop->iteration }}"></span></p>
                    <p><strong>Shipping Cost:</strong> Rp. <span id="shippingCost{{ $loop->iteration }}"></span></p>
                    <!-- Payment Proof Image -->
                    <h6>Payment Proof:</h6>
                    <div class="text-center">
                        <img id="paymentProofImage{{ $loop->iteration }}" class="img-fluid" alt="Payment Proof"
                            style="max-width: 30%; height: auto; cursor: pointer;" onclick="openImageModal(this)">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
@endforeach

<!-- Modal for Viewing Large Image -->
<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">Payment Proof Image</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <img id="largeImage" class="img-fluid" src="" alt="Large Payment Proof Image">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script>
    function loadTransactionData(button) {
        // Ambil data transaksi dari atribut data
        let transaction = JSON.parse(button.getAttribute('data-transaction'));
        let iteration = button.getAttribute('data-bs-target').replace('#detailModal', '');

        // Populate the transaction details in modal
        document.getElementById('transactionID' + iteration).textContent = transaction.ID;
        document.getElementById('paymentMethod' + iteration).textContent = transaction.PaymentMethod || '-';
        document.getElementById('totalAmount' + iteration).textContent = transaction.TotalAmount ? transaction
            .TotalAmount.toLocaleString() : '0';
        document.getElementById('status' + iteration).textContent = transaction.Status ? transaction.Status.charAt(0)
            .toUpperCase() + transaction.Status.slice(1) : '-';

        // Populate the products in the table
        let productDetailsHTML = '';
        if (transaction.TransactionDetails && transaction.TransactionDetails.length > 0) {
            transaction.TransactionDetails.forEach(detail => {
                productDetailsHTML += `
                    <tr>
                        <td>${detail.Product.Name || '-'}</td>
                        <td>Rp. ${detail.Product.Price && detail.Quantity ? (detail.Product.Price * detail.Quantity).toLocaleString() : '0'}</td>
                        <td>${detail.Size || '-'}</td>
                        <td>${detail.Quantity || '-'}</td>
                    </tr>
                `;
            });
        } else {
            productDetailsHTML = '<tr><td colspan="3">No products available.</td></tr>';
        }
        document.getElementById('productDetails' + iteration).innerHTML = productDetailsHTML;

        // Populate the shipping address info
        document.getElementById('shippingName' + iteration).textContent = transaction.ShippingAddress.Name || '-';
        document.getElementById('shippingPhone' + iteration).textContent = transaction.ShippingAddress.PhoneNumber ||
            '-';
        document.getElementById('shippingAddress' + iteration).textContent = transaction.ShippingAddress.Address || '-';
        document.getElementById('shippingCourir' + iteration).textContent = transaction.ShippingAddress.Courir || '-';
        document.getElementById('shippingDestination' + iteration).textContent =
            (transaction.ShippingAddress.DestinationLabel || '') +
            (transaction.ShippingAddress.ZipCode ? ' - ' + transaction.ShippingAddress.ZipCode : '') || '-';

        document.getElementById('shippingCost' + iteration).textContent = transaction.ShippingAddress.ShippingCost ?
            transaction.ShippingAddress.ShippingCost.toLocaleString() : '0';

        // Populate the payment proof image
        let paymentProofImage = transaction.PaymentProof ? `http://localhost:7777${transaction.PaymentProof}` : '';
        document.getElementById('paymentProofImage' + iteration).src = paymentProofImage;
    }

    function openImageModal(imageElement) {
        // Ambil URL gambar dari elemen yang diklik
        let imageUrl = imageElement.src;

        // Set gambar ke dalam modal
        document.getElementById('largeImage').src = imageUrl;

        // Tampilkan modal untuk gambar besar
        new bootstrap.Modal(document.getElementById('imageModal')).show();
    }
</script>

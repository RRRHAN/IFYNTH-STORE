    <h5 class="mb-4">Personal Information</h5>
    <form action="{{ route('update.profile') }}" method="POST">
        @csrf
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" name="username"
                    value="{{ session('user')['Username'] ?? '' }}">
            </div>
            <div class="col-md-6">
                <label class="form-label">Phone</label>
                <div class="input-group">
                    <span class="input-group-text">+62</span>
                    <input type="tel" class="form-control" name="phone_number"
                        value="{{ session('user')['PhoneNumber'] ?? '' }}" placeholder="e.g., 81234567890">
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" name="name" value="{{ session('user')['Name'] ?? '' }}">
            </div>
            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="email" value="{{ session('user')['Email'] ?? '' }}">
            </div>
        </div>
        <button type="submit" class="btn btn-secondary mt-2">Save
            Changes</button>
    </form>
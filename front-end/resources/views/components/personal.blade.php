<!-- Personal Information -->
<div class="tab-pane fade show active" id="personal" role="tabpanel">
    <h5 class="mb-4">Personal Information</h5>
    <div class="row g-3">
        <div class="col-md-6">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" value="{{ session('user')['Username'] ?? 'Enter your Username' }}">
        </div>
        <div class="col-md-6">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-control" value="{{ session('user')['PhoneNumber'] ?? 'Enter your Phone Number' }}">
        </div>
        <div class="col-md-6">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" value="{{ session('user')['Name'] ?? 'Enter your Full Name' }}">
        </div>
        <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" value="{{ session('user')['Email'] ?? 'Enter your Email' }}">
        </div>
        <div class="col-12">
            <label class="form-label">Bio</label>
            <textarea class="form-control" rows="4">Product designer with 5+ years of experience in creating user-centered digital solutions. Passionate about solving complex problems through simple and elegant designs.</textarea>
        </div>
    </div>
</div>

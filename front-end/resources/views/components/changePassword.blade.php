     <h5 class="mb-4">Security Settings</h5>
     <form action="{{ route('change.password') }}" method="POST">
         @csrf
         <div class="mb-3">
             <label class="form-label">Current Password</label>
             <input type="password" class="form-control" name="current_password" placeholder="Enter current password">
         </div>
         <div class="mb-3">
             <label class="form-label">New Password</label>
             <input type="password" class="form-control" name="new_password" placeholder="Enter new password">
         </div>
         <div class="mb-3">
             <label class="form-label">Confirm New Password</label>
             <input type="password" class="form-control" name="password_confirmation"
                 placeholder="Confirm new password">
         </div>
         <button type="submit" class="btn btn-secondary">Save
             Changes</button>
     </form>

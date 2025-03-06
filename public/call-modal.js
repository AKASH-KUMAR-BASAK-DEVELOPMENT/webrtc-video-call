const modal = `<!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Ask for join metting</h5>
        </div>
        <div class="modal-body text-center">
            <button class="btn bg-success text-white" id="acceptButton">
                Accept
            </button>
            <button class="btn bg-danger text-white" id="rejectButton">
                Reject
            </button>
        </div>
    </div>
  </div>`;

  let callResponse;

  function callConfirmation() {
    return new Promise((resolve) => {
        document.body.insertAdjacentHTML('beforeend', modal);
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();

        const timeout = setTimeout(() => {
            callResponse = false;
            myModal.hide();
            resolve(callResponse);
        }, 20000);

        document.getElementById('acceptButton').addEventListener('click', function () {
            clearTimeout(timeout);
            callResponse = true;
            myModal.hide();
            resolve(callResponse);
        });

        document.getElementById('rejectButton').addEventListener('click', function () {
            clearTimeout(timeout);
            callResponse = false;
            myModal.hide();
            resolve(callResponse);
        });
    });
}

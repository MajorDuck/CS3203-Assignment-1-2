$(document).ready(function() {
	// Fill Tables
	$('#get-button').on('click', function() {
		Show();
	});
	
	// Empty Tables
	$('#clear-button').on('click', function() {
		$('#tweetTable > tbody').html('');
		$('#userTable > tbody').html('');
	});
	
	// Get Form
	$('#get-form').on('submit', function (event) {
		event.preventDefault();
		let tweetID = $('#get-tweet-id').val();
		
		// Call server '/show' to get favs.json
		$.ajax({
			url: '/show',
			contentType: 'application/json',
			success: function(response) {
				console.log(response);
				
				// Find index of the matching tweet
				var tweetBody = $('#tweetTable > tbody');
				let index = -1;
				for (let i = 0; i < response.length; ++i)
				{
					if (response[i].id == tweetID) {
						console.log(`Found match at index = ${i}`);
						index = i;
					}
				}
				
				// Put only that tweet into the table
				tweetBody.html('');
				tweetBody.append('\
					<tr>\
						<td class="tableTID">' + response[index].created_at + '</td>\
						<td class="tableTText">' + response[index].text + '</td>\
					</tr>\
				');
				
				// Put only that tweet's user into the table
				var userBody = $('#userTable > tbody');
				userBody.html('');
				userBody.append('\
					<tr>\
						<td class="tableUName">' + response[index].user.name + '</td>\
						<td class="tableUID">' + response[index].user.id + '</td>\
					</tr>\
				');
				
				console.log('Tweet added to table');
			}
		});
		
		// Clear input field
		$("#get-tweet-id").val('');
	});
	
	// Create form
	$('#create-form').on('submit', function(event) {
		event.preventDefault();
		
		var tweetText = $("#create-tweet-text");
		var tweetID = $("#create-tweet-id");
		
		// Call server 'create' to add a new tweet
		console.log('Creating tweet..');
		$.ajax({
			url: '/create',
			method: 'POST',
			data: JSON.stringify({ text: tweetText.val(), id: tweetID.val() }),
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
				Show(); // Show updated data
			}
		});
		
		// Clear input fields
		tweetText.val('');
		tweetID.val('');
	});
	
	// Update Form
	$('#update-form').on('submit', function(event) {
		event.preventDefault();
		
		var oldUser = $("#update-old");
		var newUser = $("#update-new");
		
		// Call server '/update' to update username
		$.ajax({
			url: '/update',
			method: 'PUT',
			data: JSON.stringify( {oldname: oldUser.val(),
				newname: newUser.val()} ),
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
				Show(); // Show updated data
			}
		});
		
		oldUser.val('');
		newUser.val('');
	});
	
	// Delete form
	$('#delete-form').on('submit', function(event) { // set form
		event.preventDefault();
		var tweetID = $("#delete-id");
		
		// Call server '/delete/:id' to remove indicated tweet
		$.ajax({
			url: '/delete/' + tweetID.val(),
			method: 'DELETE',
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
				Show(); // Show updated table
			}
		});
		
		// Clear input field
		tweetID.val('');
	});

	// Refresh table
	function Show()
	{
		console.log('SHOWING');
		$.ajax({
			url: '/show',
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
				
				// This part shows the tweet data
				var tweetBody = $('#tweetTable > tbody');
				tweetBody.html('');
				
				// Creates table entries for each tweet
				response.forEach(function (product) {
					tweetBody.append('\
						<tr>\
							<td class="tableTID">' + product.created_at + '</td>\
							<td class="tableTText">' + product.text + '</td>\
						</tr>\
					');
				});
				
				// This part shows the user data without repeating users
				var userIDs = [];
				var userBody = $('#userTable > tbody');
				userBody.html('');
				
				// Creates table entries for each user
				response.forEach(function (product) {
					// Check if the user is already entered
					let isUsed = false;
					for (let i = 0; i < userIDs.length; ++i) {
						if (userIDs[i] == product.user.id)
							isUsed = true;
					}
					
					// Add entry
					if (!isUsed)
					{
						userBody.append('\
							<tr>\
								<td class="tableUName">' + product.user.name + '</td>\
								<td class="tableUID">' + product.user.id + '</td>\
							</tr>\
						');
						
					}
				});
			}
		});
		
		
	}
})
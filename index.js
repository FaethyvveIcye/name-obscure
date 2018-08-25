module.exports = function(dispatch) {
	var enabled = true;
	var nameToObscure = "Character.Name";
	
	var encoding = "UTF-16LE";
	var nameToObscureBuffer = Buffer.from(nameToObscure, encoding);
	
	dispatch.hook('*', 'raw', {order: 999, filter: {incoming: true}}, (code, data) => {
		if (enabled && (data.length > 4)) { // only non-empty packets
			tryReplaceAllNamesInBuffer(data, 4);
		}
	});
	
	function tryReplaceAllNamesInBuffer(data, offset) {
		if ((data.length - offset) >= (nameToObscureBuffer.length + 2)) { // +2: TERA terminates strings with a UTF-16LE NUL
			var start = data.indexOf(nameToObscureBuffer, offset);
			if (start != -1) {
				data.fill("l", start, (start + nameToObscureBuffer.length), encoding);
				tryReplaceAllNamesInBuffer(data, (start + nameToObscureBuffer.length + 2));
			}
		}
	}
};
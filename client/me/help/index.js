import page from 'page';
import { sidebar } from 'me/controller';
import { help, contact } from './controller';

module.exports = function() {
	page( '/help', sidebar, help );
	page( '/help/contact', sidebar, contact );
};

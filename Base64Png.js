const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Gtk = imports.gi.Gtk;

Gio.resources_register(Gio.resource_load('org.gnome.Base64Png.gresource'));

Gtk.init(null, null);

let builder = Gtk.Builder.new_from_resource('/org/gnome/Base64Png/Base64Png.ui');
let $ = function(name) { return builder.get_object(name); };


$('window').show();
$('close-button').connect('clicked', Gtk.main_quit);

$('textview').buffer.connect('changed', function(buffer) {
  $('image').set_from_icon_name('image-missing', Gtk.IconSize.DIALOG);

  let text = buffer.get_text(buffer.get_start_iter(), buffer.get_end_iter(), false);
  let data = GLib.base64_decode(text);

  try {
    let loader = new GdkPixbuf.PixbufLoader();
    loader.write(data);
    loader.close();
    $('image').set_from_pixbuf(loader.get_pixbuf());
  } catch (e) {
    log(e);
  }
});

Gtk.main();

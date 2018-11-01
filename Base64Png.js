const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Gtk = imports.gi.Gtk;

Gio.resources_register(Gio.resource_load('org.gnome.Base64Png.gresource'));

Gtk.init(null);

let builder = Gtk.Builder.new_from_resource('/org/gnome/Base64Png/Base64Png.ui');
let $ = function(name) { return builder.get_object(name); };


$('window').show();
$('window').connect('destroy', function() { Gtk.main_quit() });

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

let saveDialog = $('save-dialog');
saveDialog.add_button("_Open", Gtk.ResponseType.OK);
saveDialog.add_button("_Cancel", Gtk.ResponseType.CANCEL);

let saveFile = function(uri) {
  let pixbuf = $('image').pixbuf;
  let file = Gio.File.new_for_uri(uri);
  let path = file.get_path();
  if (path.match(/.*\.png/))
    pixbuf.savev(path, "png", [], []);
  else if (path.match(/.*\.jpg/) ||
           path.match(/.*\.jpeg/))
    pixbuf.savev(path, "jpeg", [], []);
  else
    pixbuf.savev(path + '.png', "png", [], []);
};

saveDialog.connect('response', function() {
  saveFile(saveDialog.get_uri());
  saveDialog.hide();
});
saveDialog.connect('delete-event', function() {
  saveDialog.hide();
  return true;
});
saveDialog.connect('file-activated', function() {
  saveFile(saveDialog.get_current_name());
  saveDialog.hide();
});
$('save-button').connect('clicked', function() {
  saveDialog.show();
});

$('image').connect('notify::pixbuf', function() {
  $('save-button').sensitive = $('image').pixbuf != null;
});

//
Gtk.main();

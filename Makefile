O1 =
O = @
OO = $(O$(V))

GCR = $(OO) echo " GLIB_COMPILE_RESOURCES " $@; glib-compile-resources

org.gnome.Base64Png.gresource: org.gnome.Base64Png.gresource.xml *.ui
	$(OO) $(GCR) --sourcedir=. org.gnome.Base64Png.gresource.xml

GENERATED_FILES = \
	org.gnome.Base64Png.gresource

all: $(GENERATED_FILES)

clean:
	$(OO) rm -f $(GENERATED_FILES)

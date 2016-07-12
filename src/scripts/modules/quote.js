'use strict';

/**
 * @module quote
 */
var quote = function () {
    this.errors = {};

    this
        .handleRequest()
    ;
};

/**
 *
 * @returns {quote}
 */
quote.prototype.handleRequest = function () {
    var
        self            = this,
        $form           = document.querySelector('.forms-request-quote'),
        request         = new XMLHttpRequest(),
        $anotherMessage = $form.querySelector('.another-message a')
        ;

    $anotherMessage.addEventListener('click', function (evt) {
        $form.classList.remove('success');
    });

    $form.addEventListener('submit', function (evt) {
        evt.preventDefault();

        self.validate(function (errors) {
            var url = './validation-ok.json';

            if (Object.keys(errors).length > 0) {
                url = './validation-fail.json'
            }

            request.open('GET', url, true);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);

                    if (data.code === 100) {
                        $form.classList.add('success');
                    } else {
                        $form.classList.remove('success');
                    }
                }
            };

            request.send();
        });
    });

    return this;
};

/**
 * @param {Function} cb
 */
quote.prototype.validate = function (cb) {
    var
        self   = this,
        $form  = document.querySelector('.forms-request-quote'),
        fields = {
            name:    $form.querySelector('input[name="name"]'),
            email:   $form.querySelector('input[name="email"]'),
            message: $form.querySelector('textarea[name="message"]')
        }
        ;

    self.errors = {};

    Object.keys(fields).forEach(function (field) {
        if (fields[field].value &&
            fields[field].value == typeof undefined ||
            fields[field].value == ''
        ) {
            self.errors[field] = true;
        }
    });

    Object.keys(fields).forEach(function (field) {
        var
            $fieldContainer = $form.querySelector('.field-' + field);

        if (self.errors[field] && $fieldContainer) {
            if ($fieldContainer.classList) {
                $fieldContainer.classList.add('invalid');
            }
        } else {
            if ($fieldContainer.classList) {
                $fieldContainer.classList.remove('invalid');
            }
        }
    });

    cb(self.errors);
};

module.exports = quote;

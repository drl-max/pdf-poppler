const path = require('path');
const {execFile} = require('child_process');

const FORMATS = ['png', 'jpeg', 'tiff', 'pdf', 'ps', 'eps', 'svg'];
const info = require('./os-info');
const EXEC_OPTS = info.exec_options;

let defaultOptions = {
    format: 'jpeg',
    scale: 1024,
    out_dir: null,
    out_prefix: null,
    page: null
};

// module.exports = function (file, out_file, page_start, page_end) {
module.exports = function (file, opts = {}) {
    return new Promise((resolve, reject) => {
        opts.format = FORMATS.includes(opts.format) ? opts.format : defaultOptions.format;
        opts.scale = opts.scale || defaultOptions.scale;
        opts.out_dir = opts.out_dir || defaultOptions.out_dir;
        opts.out_prefix = opts.out_prefix || path.dirname(file);
        opts.out_prefix = opts.out_prefix || path.basename(file, path.extname(file));
        opts.page = opts.page || defaultOptions.page;
        opts.popplerPath = opts.popplerPath || info.path;

        let args = [];
        args.push([`-${opts.format}`]);
        if (opts.page) {
            args.push(['-f']);
            args.push([parseInt(opts.page)]);
            args.push(['-l']);
            args.push([parseInt(opts.page)]);
        }
        if (opts.scale) {
            args.push(['-scale-to']);
            args.push([parseInt(opts.scale)]);
        }
        args.push(`${file}`);
        args.push(`${path.join(opts.out_dir, opts.out_prefix)}`);

        execFile(path.join(opts.popplerPath, 'pdftocairo'), args, EXEC_OPTS, (error, stdout, stderr) => {
            if (error) {
                error.stdout = stdout;
                error.sterr = stderr;
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
};
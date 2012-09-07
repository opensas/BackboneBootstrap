require(
  [
    'jasmine-html', 
    'spec/convert.spec',
    'spec/crud.spec'
  ],
function() {
  jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
  jasmine.getEnv().execute();
});
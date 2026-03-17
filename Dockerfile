FROM ruby:2.6

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential nodejs

# Set locale
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install specific bundler version
RUN gem install bundler:1.16.0

# Install gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "8080"]
